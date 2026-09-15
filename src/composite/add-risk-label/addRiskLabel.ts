import { az } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { execa } from "execa";
import z from "zod";

export interface AddRiskLabelInputs {
  lowRiskLabelName: string;
  mediumRiskLabelName: string;
  highRiskLabelName: string;
  labelToAdd: string;
  pullRequestNumber: number;
  githubToken: string;
  githubRepository: string;
}

const labelsSchema = z.object({
  labels: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      color: z.string(),
    }),
  ),
});

async function addRiskLabel({
  lowRiskLabelName,
  mediumRiskLabelName,
  highRiskLabelName,
  labelToAdd,
  pullRequestNumber,
  githubToken,
  githubRepository,
}: AddRiskLabelInputs) {
  const validLabels = [lowRiskLabelName, mediumRiskLabelName, highRiskLabelName];
  if (!validLabels.includes(labelToAdd)) {
    throw new DataError(
      { validLabels, labelToAdd },
      "INVALID_LABEL",
      "The label being added is not a valid label.",
    );
  }

  const githubActionsClient = execa({
    env: {
      GH_TOKEN: githubToken,
      GH_REPO: githubRepository,
    },
  });

  const { stdout } = await githubActionsClient`gh pr view ${pullRequestNumber} --json labels`;

  const { labels } = az.with(labelsSchema).parse(JSON.parse(stdout));
  const existingRiskLabels = labels
    .map((label) => {
      return label.name;
    })
    .filter((name) => {
      return validLabels.includes(name);
    });

  if (existingRiskLabels.includes(labelToAdd)) {
    console.info("Risk label already added.");
    return;
  }

  for (const label of existingRiskLabels) {
    await githubActionsClient({
      stdio: "inherit",
    })`gh pr edit ${pullRequestNumber} --remove-label ${label}`;
  }

  await githubActionsClient({
    stdio: "inherit",
  })`gh pr edit ${pullRequestNumber} --add-label ${labelToAdd}`;
}

export default addRiskLabel;
