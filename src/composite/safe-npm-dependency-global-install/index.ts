import { getBooleanInput, getInput } from "@actions/core";
import { az } from "@alextheman/utility";
import { DependencyGroup, PackageManager } from "@alextheman/utility/internal";
import z from "zod";

import safeNpmDependencyGlobalInstall from "src/composite/safe-npm-dependency-global-install/safeNpmDependencyGlobalInstall";
import getOptionalInput from "src/utility/getOptionalInput";

(async () => {
  await safeNpmDependencyGlobalInstall({
    packageName: getInput("package-name", { required: true }),
    versionRange: getOptionalInput("version-range"),
    packageManager: az
      .with(z.enum(PackageManager))
      .parse(getOptionalInput("package-manager") ?? PackageManager.NPM),
    dependencyGroup: az
      .with(z.enum(DependencyGroup))
      .parse(getOptionalInput("dependency-group") ?? DependencyGroup.DEPENDENCIES),
    strictVersionResolution: getBooleanInput("strict-version-resolution"),
  });
})();
