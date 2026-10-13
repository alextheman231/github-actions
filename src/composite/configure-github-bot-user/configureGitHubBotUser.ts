import { az } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

export interface ConfigureGitHubBotUserInputs {
  appSlug: string;
}

async function configureGitHubBotUser({ appSlug }: ConfigureGitHubBotUserInputs) {
  const { stdout: json } = await execa`gh api users/${appSlug}[bot] --jq '.id'`;
  const payload = JSON.parse(json);
  const botId = az.with(z.int()).parse(payload.id);

  await execa({
    stdio: "inherit",
  })`git config --global user.name ${appSlug}[bot]`;
  await execa({
    stdio: "inherit",
  })`git config --global user.email ${botId}+${appSlug}[bot]@users.noreply.github.com`;
}

export default configureGitHubBotUser;
