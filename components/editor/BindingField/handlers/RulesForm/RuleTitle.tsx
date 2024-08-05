import { extractContextAndAttributes } from "@/components/editor/BindingField/handlers/RulesForm/LocationField";
import { logicalRulesData } from "@/components/editor/BindingField/handlers/RulesForm/SelectComparisonRuleField";
import { ConditionProps, DataType, RuleItemProps } from "@/types/dataBinding";
import { isEmpty } from "@/utils/common";
import { Text } from "@mantine/core";
import get from "lodash.get";

export const RuleTitle = ({
  ruleProps,
  fallback = "",
}: {
  ruleProps: RuleItemProps;
  fallback: string;
}) => {
  const condition: ConditionProps = get(
    ruleProps,
    "conditions[0]",
    {} as ConditionProps,
  );

  if (condition.location === undefined || condition.rule === undefined) {
    return (
      <Text size={14} weight="bold">
        {fallback}
      </Text>
    );
  }

  const value =
    condition.value?.dataType === "boundCode"
      ? extractContextAndAttributes(condition.value.boundCode ?? "").context
      : condition.value?.static;

  let conditionString = `${logicalRulesData.find((item) => item.value === condition.rule)?.label}`;
  if (!isEmpty(value)) conditionString += ` > ${value}`;

  const result =
    ruleProps.result?.dataType === DataType.boundCode
      ? extractContextAndAttributes(ruleProps.result?.boundCode).context
      : ruleProps.result?.static;

  return (
    <>
      <Text size={14} weight="bold">
        {extractContextAndAttributes(condition.location).context}
      </Text>
      <Text size={11} c="gray.6">
        {conditionString}
        {result !== undefined && ` > ${result}`}
      </Text>
    </>
  );
};
