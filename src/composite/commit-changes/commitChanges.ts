import { setOutput } from "@actions/core";
import { execa } from "execa";

export interface CommitChangesInputs {
  message: string;
  path: string;
}

async function commitChanges({ message, path }: CommitChangesInputs) {
  const { exitCode } = await execa({ reject: false })`git status --porcelain`;

  if (exitCode === 0) {
    console.info("No changes detected.");
    setOutput("changes-detected", false);
  } else {
    await execa({ stdio: "inherit" })`git add ${path}`;
    await execa({ stdio: "inherit" })`git commit -m ${message}`;
    setOutput("changes-detected", true);
  }
}

export default commitChanges;
