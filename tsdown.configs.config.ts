import type { UserConfig } from "tsdown";

const config: UserConfig = {
  clean: true,
  dts: true,
  entry: ["configs/alex-c-line/index.ts"],
  fixedExtension: false,
  format: ["esm"],
  outDir: "dist-configs",
};

export default config;
