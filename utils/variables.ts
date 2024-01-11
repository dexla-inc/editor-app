import { useInputsStore } from "@/stores/inputs";

export const getParsedJSCode = (code: string) => {
  // check for components in the code and replace them with their values
  // components pattern: components[/* Select */'HhAFGI99Hr6GfGzW_NxyH']
  const componentsRegex = /components\[\/\* ([\w]+) \*\/'([\w]+)'\]/g;
  const inputsValues = useInputsStore.getState().inputValues;
  const parsedCode = code.replace(
    componentsRegex,
    (_, componentName, componentId) => {
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
    },
  );

  return parsedCode;
};
