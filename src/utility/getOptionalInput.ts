import { getInput } from "@actions/core";

function getOptionalInput(name: string): string | undefined {
  const value = getInput(name);
  return value === "" ? undefined : value;
}

export default getOptionalInput;
