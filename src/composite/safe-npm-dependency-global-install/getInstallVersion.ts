import type { CreateEnumType } from "@alextheman/utility";

import { DataError } from "@alextheman/utility/v6";

interface GetInstallVersionArguments {
  dependencies: Record<string, string>;
  packageName: string;
  versionRange?: string;
  strictVersionResolution?: boolean;
}

export const ResolvedFromMessage = {
  WORKFLOW_INPUT: "resolved from workflow input",
  PACKAGE_JSON: "resolved from package.json",
  FALLBACK:
    "fallback: not found in package.json, no version-range provided, strict-version-resolution=false",
} as const;
export type ResolvedFromMessage = CreateEnumType<typeof ResolvedFromMessage>;

function getInstallVersion({
  dependencies,
  packageName,
  versionRange,
  strictVersionResolution,
}: GetInstallVersionArguments): [string, string] {
  if (versionRange) {
    return [
      versionRange,
      `Installing ${packageName}@${versionRange} (${ResolvedFromMessage.WORKFLOW_INPUT})`,
    ];
  } else if (packageName in dependencies) {
    return [
      dependencies[packageName],
      `Installing ${packageName}@${dependencies[packageName]} (${ResolvedFromMessage.PACKAGE_JSON})`,
    ];
  } else if (!strictVersionResolution) {
    return ["latest", `Installing ${packageName}@latest (${ResolvedFromMessage.FALLBACK})`];
  }
  throw new DataError(
    {
      packageName,
      strictVersionResolution,
      packageFoundInDependencies: packageName in dependencies,
      inputVersion: versionRange,
    },
    "VERSION_RESOLUTION_ERROR",
    `Could not resolve the version. Expected to find ${packageName} in package.json, or a version range input provided, but neither was found.`,
  );
}

export default getInstallVersion;
