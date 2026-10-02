import { setOutput } from "@actions/core";
import { az, normaliseIndents } from "@alextheman/utility";
import z from "zod";

import { readFile } from "node:fs/promises";

interface GetPackageMetadataInputs {
  packageJsonPath: string;
}

const minimalPackageJsonSchema = z.object({
  name: z.string(),
  version: az.versionNumber(),
});

async function getPackageMetadata({ packageJsonPath }: GetPackageMetadataInputs) {
  const { name, version } = az
    .with(minimalPackageJsonSchema)
    .parse(JSON.parse(await readFile(packageJsonPath, "utf-8")));

  console.info(normaliseIndents`
        Package name: ${name}
        Package version: ${version}
    `);

  setOutput("package-name", name);
  setOutput("package-version", version.toString());
}

export default getPackageMetadata;
