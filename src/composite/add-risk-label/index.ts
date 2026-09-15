import { getInput } from "@actions/core";
import { parseIntStrict } from "@alextheman/utility";

import addRiskLabel from "src/composite/add-risk-label/addRiskLabel";
import getOptionalInput from "src/utility/getOptionalInput";

(async () => {
  await addRiskLabel({
    lowRiskLabelName: getOptionalInput("low-risk-label-name") ?? "low risk",
    mediumRiskLabelName: getOptionalInput("medium-risk-label-name") ?? "medium risk",
    highRiskLabelName: getOptionalInput("high-risk-label-name") ?? "high risk",
    labelToAdd: getInput("label-to-add"),
    pullRequestNumber: parseIntStrict(getInput("pull-request-number")),
    githubToken: getInput("github-token"),
    githubRepository: getInput("github-repository"),
  });
})();
