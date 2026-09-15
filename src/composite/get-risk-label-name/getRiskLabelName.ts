import type { CreateEnumType } from "@alextheman/utility";

import { setOutput } from "@actions/core";

export const RiskLevel = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;
export type RiskLevel = CreateEnumType<typeof RiskLevel>;

export interface CheckRiskLevelInputs {
  lowRiskLabelName: string;
  mediumRiskLabelName: string;
  highRiskLabelName: string;
  riskLevel: RiskLevel | null;
}

async function getRiskLabelName({
  lowRiskLabelName,
  mediumRiskLabelName,
  highRiskLabelName,
  riskLevel,
}: CheckRiskLevelInputs) {
  switch (riskLevel) {
    case "low": {
      setOutput("label", lowRiskLabelName);
      break;
    }
    case "medium": {
      setOutput("label", mediumRiskLabelName);
      break;
    }
    case "high": {
      setOutput("label", highRiskLabelName);
      break;
    }
    case null: {
      return;
    }
    default: {
      throw riskLevel satisfies never;
    }
  }
}

export default getRiskLabelName;
