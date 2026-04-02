import { defineAlexCLineConfig } from "alex-c-line/configs";

export default defineAlexCLineConfig({
  template: {
    pullRequest: {
      category: "general",
      projectType: "package",
    },
  },
  preCommit: {
    packageManager: "pnpm",
    steps: [
        "format", 
        async (stepRunner) => {
            await stepRunner`pdm run format`;
        },
        "lint",
      async (stepRunner) => {
        await stepRunner`pdm run lint`;
      },
    ],
  },
});
