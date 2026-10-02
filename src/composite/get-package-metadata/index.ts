import { getInput } from "@actions/core";

import path from "node:path";

import getPackageMetadata from "src/composite/get-package-metadata/getPackageMetadata";

(async () => {
  await getPackageMetadata({
    packageJsonPath: path.resolve(getInput("package-json-path")),
  });
})();
