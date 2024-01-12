import { useInputsStore } from "@/stores/inputs";

const getParsedComponentCode = (
  code: string,
  componentsRegex: RegExp,
  inputsValues: Record<string, any>,
) => {
  return code.replace(componentsRegex, (_, componentName, componentId) => {
    const value = inputsValues[componentId];
    if (value === undefined) {
      return `undefined`;
    }

    const isObject = typeof value === "object";
    const isArray = Array.isArray(value);

    if (isObject || isArray) {
      return JSON.stringify(value);
    }

    return `"${value}"`;
  });
};

const getParsedContextItemCode = (
  code: string,
  contextItemRegex: RegExp,
  contextValues: any,
) => {
  return code.replace(contextItemRegex, (_, itemId) => {
    const item = contextValues?.find((item: any) => item[itemId]);
    const value = item[itemId];

    if (value === undefined) {
      return `undefined`;
    }

    const isObject = typeof value === "object";
    const isArray = Array.isArray(value);

    if (isObject || isArray) {
      return JSON.stringify(value);
    }

    return `"${value}"`;
  });
};

export const getParsedJSCode = (code: string, actionData?: any) => {
  // check for components in the code and replace them with their values
  // components pattern: components[/* Select */'HhAFGI99Hr6GfGzW_NxyH']
  const componentsRegex = /components\[\/\* ([\w]+) \*\/'([\w]+)'\]/g;
  const contextItemRegex = /context\.item\['([^']+)'\]/;
  const inputsValues = useInputsStore.getState().inputValues;
  let parsedCode = "";
  if (componentsRegex.test(code))
    parsedCode = getParsedComponentCode(code, componentsRegex, inputsValues);
  if (contextItemRegex.test(code))
    parsedCode = getParsedContextItemCode(code, contextItemRegex, actionData);
  return parsedCode;
};
