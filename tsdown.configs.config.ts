import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: ["configs/alex-c-line/index.ts"],
  outDir: "dist-configs",
  format: ["esm"],
  dts: true,
  clean: true,
  fixedExtension: false,
};

export default config;
