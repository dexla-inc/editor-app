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

export const getAuthValue = (code: string, authData: any) => {
  // check for auth in the code and replace them with their values
  // auth pattern: return auth['accessToken']
  const authsRegex = /auth\['([\w]+)'\]/g;
  const parsedCode = code.replace(authsRegex, (_, authKey) => {
    const value = authData?.find(
      (auth: any) => auth.id === authKey || auth.name === authKey,
    )?.value;

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

  return parsedCode;
};
