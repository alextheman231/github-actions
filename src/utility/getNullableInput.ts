import { getInput } from "@actions/core";

function getNullableInput(name: string): string | null {
  const value = getInput(name);
  return value === "" ? null : value;
}

export default getNullableInput;
