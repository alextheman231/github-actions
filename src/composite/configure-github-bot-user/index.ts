import { getInput } from "@actions/core";

import configureGitHubBotUser from "src/composite/configure-github-bot-user/configureGitHubBotUser";

(async () => {
  await configureGitHubBotUser({
    appSlug: getInput("app-slug"),
  });
})();
