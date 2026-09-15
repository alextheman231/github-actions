import type { AlexCLineConfig } from "alex-c-line/configs";

import preCommitConfig from "configs/alex-c-line/preCommit";

import { scripts } from "package.json" with { type: "json" };

const alexCLineConfig: AlexCLineConfig<keyof typeof scripts> = {
  preCommit: preCommitConfig,
};

export default alexCLineConfig;
