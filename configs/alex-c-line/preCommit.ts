import type { PreCommitConfig } from "alex-c-line/configs";

import { scripts } from "package.json" with { type: "json" };

const preCommitConfig: PreCommitConfig<keyof typeof scripts> = {
  packageManager: "pnpm",
  steps: [
    "build",
    "format",
    async (stepRunner) => {
      await stepRunner`pdm run format`;
    },
    "lint",
    async (stepRunner) => {
      await stepRunner`pdm run lint`;
    },
  ],
};

export default preCommitConfig;
