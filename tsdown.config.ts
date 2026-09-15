import type { UserConfig } from "tsdown";
import packageInfo from "./package.json" with { type: "json" };

const ALL_THE_DEPENDENCIES_TO_BUNDLE_BECAUSE_GITHUB_ACTIONS_IS_GARBAGE = [
  ...Object.keys(packageInfo.dependencies),
  "@alextheman/utility/internal",
  "@alextheman/utility/v6",
];

const config: Array<UserConfig> = [
  {
    entry: ["src/composite/safe-npm-dependency-global-install/index.ts"],
    outDir: "composite/safe-npm-dependency-global-install/dist",
  },
  {
    entry: ["src/composite/get-risk-label-name/index.ts"],
    outDir: "composite/get-risk-label-name/dist",
  },
  {
    entry: ["src/composite/add-risk-label/index.ts"],
    outDir: "composite/add-risk-label/dist",
  },
].map(({ entry, outDir }) => {
  return {
    entry,
    outDir,
    format: ["esm"],
    dts: true,
    clean: true,
    fixedExtension: false,
    deps: {
      alwaysBundle: ALL_THE_DEPENDENCIES_TO_BUNDLE_BECAUSE_GITHUB_ACTIONS_IS_GARBAGE,
    },
  };
});

export default config;
