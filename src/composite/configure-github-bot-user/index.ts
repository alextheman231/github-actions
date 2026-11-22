import { getInput } from "@actions/core";

import configureGitHubBotUser from "src/composite/configure-github-bot-user/configureGitHubBotUser";

void (async () => {
  await configureGitHubBotUser({
    appSlug: getInput("app-slug"),
  });
})();
