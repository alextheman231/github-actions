import { az } from "@alextheman/utility";
import z from "zod";

import getRiskLabelName, { RiskLevel } from "src/composite/get-risk-label-name/getRiskLabelName";
import getNullableInput from "src/utility/getNullableInput";
import getOptionalInput from "src/utility/getOptionalInput";

(async () => {
  await getRiskLabelName({
    riskLevel: az
      .with(z.enum(RiskLevel).nullable())
      .parse(getNullableInput("risk-level")?.toLowerCase() ?? null),
    lowRiskLabelName: getOptionalInput("low-risk-label-name") ?? "low risk",
    mediumRiskLabelName: getOptionalInput("medium-risk-label-name") ?? "medium risk",
    highRiskLabelName: getOptionalInput("high-risk-label-name") ?? "high risk",
  });
})();
