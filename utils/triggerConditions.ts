import { useVariableStore } from "@/stores/variables";

export const triggerConditions = [
  "none",
  "equal",
  "notEqual",
  "regex",
  "startsWith",
  "endsWith",
] as const;
export type NodeTriggerCondition = (typeof triggerConditions)[number];

export const getDescriptionFromTriggerCondition = (
  triggerCondition: NodeTriggerCondition,
) => {
  switch (triggerCondition) {
    case "equal":
      return "Check if output is equal a given value";
    case "notEqual":
      return "Check if output is not equal a given value";
    case "startsWith":
      return "Check if output starts with a given value";
    case "endsWith":
      return "Check if output ends with a given value";
    case "regex":
      return "Check if output matches a given regular expression";
    default:
      return "Will always trigger";
  }
};

type CheckIfValidType = {
  condition: NodeTriggerCondition;
  data: any;
  conditionValue: string;
};

export const checkIfValid = ({
  condition,
  data,
  conditionValue,
}: CheckIfValidType) => {
  const variable = data?.form?.variable ? JSON.parse(data?.form?.variable) : "";
  const variables = useVariableStore.getState().variableList;
  const _var = variables[variable?.name ?? ""];
  let value = _var?.defaultValue ?? "";

  switch (condition) {
    case "equal":
      return value === conditionValue;
    case "notEqual":
      return value !== conditionValue;
    case "startsWith":
      return value?.startsWith(conditionValue);
    case "endsWith":
      return value?.endsWith(conditionValue);
    case "regex":
      return new RegExp(conditionValue).test(value);
    default:
      return true;
  }
};
