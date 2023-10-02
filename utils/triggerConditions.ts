import { useEditorStore } from "@/stores/editor";

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

function getElementValue(value: string, iframeWindow: any): string {
  const _id = value.split("valueOf_")[1];
  let el = iframeWindow?.document.getElementById(_id);
  const tag = el?.tagName?.toLowerCase();

  if (tag !== "input") {
    el = el?.getElementsByTagName("input")[0];
  }

  return (el as HTMLInputElement)?.value ?? "";
}

export const checkIfValid = ({
  condition,
  data,
  conditionValue,
}: CheckIfValidType) => {
  const iframeWindow = useEditorStore.getState().iframeWindow;
  const variable = data?.form?.variable ? JSON.parse(data?.form?.variable) : "";
  let value = variable?.value ?? variable?.defaultValue ?? "";

  if (value?.startsWith(`valueOf_`)) {
    value = getElementValue(value, iframeWindow);
  }

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
