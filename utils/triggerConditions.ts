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
