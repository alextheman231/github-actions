# Incident on 31/3/2026 - Release Block and Dependency Attack

**Severity**: High
**Incident Type**: Deployment Failure

This document details a serious incident related to `github-actions` which significantly impacted regular usage. Please read below for a description of what went wrong and the steps being taken to resolve it.

## Description of Incident

### Incident Summary

- On install of the latest `alex-c-line` in our `commit-version-change` workflow, as part of its dependency resolution it brought in unexpected versions of several packages, the worst of them being `@alextheman/utility` at `v5.9.0` and `axios` at `v1.14.1`.
- The `@alextheman/utility` one was bad because it moved a function across entrypoints, and therefore prevented `alex-c-line` from being able to run in workflows at all. This affected our ability to publish our packages.
- The `axios` one was even worse because that one executed a malicious script that could've potentially compromised our workflow secrets.

### Cause(s) of Incident

#### Primary Cause

- Loosely-pinned versions of all our dependencies is what I would consider to be the primary cause.
    - Prior to the incident, all dependencies were being pinned at `^<version>`.
    - In the GitHub Actions, it was even worse because we pinned globally-installed dependencies at latest. This included the bad `alex-c-line` version that brought in the bad `@alextheman/utility` and `axios` versions.
    - The `^` prefix allows minor and patch version updates, which can introduce unintended changes when new versions are released.
    - Because the bad versions of `@alextheman/utility` and `axios` were released under minor/patch versions, those then got pulled in as `^` allowed it, therefore compromising our workflows.

#### Other Contributing Factors

- I did release the entrypoint change in `@alextheman/utility` under a minor release rather than a major release. Had I done this under a major release, the `^` would have not pulled in the bad version.
    - However, at the time I didn't feel like this quick entrypoint change was enough to justify a major release, as the fix only affected one function that I was not expecting to be used much. `alex-c-line` was unfortunately one of the few that did use it.
- The reason for the entrypoint move in `@alextheman/utility` in the first place was because the front-end build in Lexicon was giving warnings due to a function that relies on Node behaviour being exported from the root entrypoint of `@alextheman/utility`, therefore meaning it got included in the front-end build, and Vite bundlers don't like that.
    - This by itself is not the worst issue ever and is easily fixable, but it can be considered another lesson learned from the incident to ensure that we are careful about exactly which functions get exported from which entrypoints so that consumers of the package can actually use the root of my utility package in any JavaScript runtime. It helps with accessibility of the package as well as keeping bundle sizes optimal.

### Consequences of Incident

- All releases of my packages were blocked as a result of `alex-c-line` being broken in CI.
- Even fixing the workflows themselves in the `github-actions` repository would not have worked as we also need `alex-c-line` to help with the release process.
- The install of `axios` implicitly through `alex-c-line` could've resulted in some very bad consequences, especially if it went into the part of `commit-version-change` that actually commits the version change! Thankfully it did not, though.

### Things That Went Well

- Clear separation of concerns 
    - Most of our publish/publish preparation workflows do a check with pure read access first to ensure that the repository state as is meets the necessary conditions for publish, and only acts if met.
- Usage of a GitHub App with an encrypted private key rather than a PAT token directly 
    - The PAT would've allowed the attacker to interact with the GitHub API under my name.
    - However, the bot user's private key by itself cannot be used directly - it must first be used to access a token, and that token is then what can be used to interact with the GitHub API.
    - However, such interactions are clearly permission-scoped, the tokens are also short-lived, and interactions are under the bot user rather than my personal account.
    - This means that, at worst, we may get some suspicious alex-up-bot behaviour, but I'd much rather that than said suspicious behaviour be tied directly to my personal account.
    - Combine that with the fact that the private key is encrypted in Terraform Cloud, and that encrypted value is what we pass to GitHub, and we have many layers of security with our alex-up-bot setup that would make it very hard for an attacker to compromise our setup.
- The existence of the fallback local `alex-c-line` workflows from when we released `alex-c-line` v2.
    - This made it so much easier to quickly recover as I could just use those local workflows that I know works as is, rather than spend a ton of extra time trying to debug the local workflows, especially under the pressure of the broken release process.

## Timeline

- I realised an issue with the Lexicon front-end build where the logs display a warning message followed by multiple lines of minified output.
- I then linked the issue back to an exports issue with `@alextheman/utility`
- I fixed the issue in `@alextheman/utility`.
- I released `v5.9.0` of `@alextheman/utility` with the change.
- I then went back to Lexicon to update `@alextheman/utility` to fix the front-end build issues.
- The pre-commits failed because after updating `@alextheman/utility` there, `alex-c-line` used `v5.9.0` of utility before I got a chance to fix the entrypoints there.
- I double-checked the workflows and realised that the GitHub release of `@alextheman/utility` failed because of the above `alex-c-line` issue.
- I fixed the issue in `alex-c-line`.
- I got a release of `alex-c-line` out by using a version of the `commit-version-change` that runs using `alex-c-line`'s own local source code.
- I then re-ran the failing `@alextheman/utility` workflow to get the GitHub release out.
- After merging an unrelated change in, unbeknownst to me, [the `commit-version-change` workflow this triggered](https://github.com/alextheman231/utility/actions/runs/23776421959) caused `alex-c-line` to be installed at latest again, and this time the loose pinning brought in the compromised version of `axios`.
- I received an email about this a few days later, with the exact link to the workflow that ran with the bad `axios` version.

## Action Plan

- Rotate any potential compromised secrets as a result of the `axios` attack.
    - This is done - I changed the `ALEX_UP_BOT_PRIVATE_KEY`, and more crucially the `TFE_TOKEN`.
- Properly scope the `TFE_TOKEN` to Infrastructure only.
    - This is done - there is no need for other repositories to know about this because they do not interact with Terraform.
- Pin all direct dependencies to exact versions.
    - This is done - we now pin at exactly `5.9.0`, for example, rather than `^5.9.0`.
        - It is worth noting that there is a minor-ish trade-off where it means that we get more duplication of certain dependencies, but I think it's a fine trade-off for more explicitness in what gets installed.
        - Note that peer dependencies are still kept loose so that consumers of our packages can still install versions of our peer dependencies that work with them, rather than be forced strictly into what we're using at the moment.
- Add a `safe-npm-dependency-global-install` composite action.
    - This is partly done - it has been added to the newly-created `typescript-actions` repository.
        - As of now, it supports globally installing a dependency based on the package.json version, or the exact specified version in the `version-range` input.
        - However, note that it does not yet support installing from a packed tarball generated locally. Last time I tried it did not go too successfully, so I am still investigating how to best do this.
        - That said, most of the core features are there now, and the fact that we can keep the `alex-c-line` version that gets used in the workflows aligned with what the project uses now - that to me is a very big win.
- Add an incidents template to `alex-c-line` so we can track serious issues.
    - This is yet to be done - this incident document was created manually.
    - Eventually, `alex-c-line` should generate the initial document, and then from there we can fill it in manually.

## Additional Notes

- The fact that we had our release incident just moments before the `axios` incident is very unfortunate timing!
- However, we are also very lucky that the attack didn't spread any further beyond a simple read job that could've escalated into the pull request creation, but thankfully did not.
- A lot of design decisions we have made throughout the organisation definitely did reduce the blast radius as much as it possibly could've.
- However, we did have our shortcomings that have been listed throughout this document already.
- That said, despite the initial shortcomings:
    - We now have a clear action plan that has mostly been implemented at the time of writing.
    - We have a better understanding of exactly what role those version prefixes in `package.json` play, and why for our use case it is better to avoid them.
    - We have officially started the `typescript-actions` repository with a solid first action that deals with one of the biggest issues we have had so far with our workflows.
- I'd say we did the best we can given the pressure and given the circumstances, and the organisation's dependency management has improved a lot as a result of this.
