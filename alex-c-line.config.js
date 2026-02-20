import { packageConfig } from "alex-c-line/configs/internal";
import path from "node:path";

const artworkPath = path.join(process.cwd(), "artwork");

export default packageConfig([
  "format",
  async (stepRunner) => {
    await stepRunner({ cwd: artworkPath })`pdm run format`;
  },
  "lint",
  async (stepRunner) => {
    await stepRunner({ cwd: artworkPath })`pdm run lint`;
  },
]);
