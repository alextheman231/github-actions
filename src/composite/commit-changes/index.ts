import { getInput } from "@actions/core";

import commitChanges from "src/composite/commit-changes/commitChanges";
import getOptionalInput from "src/utility/getOptionalInput";

(async () => {
  await commitChanges({
    message: getInput("message"),
    path: getOptionalInput("path") ?? "-A",
  });
})();
