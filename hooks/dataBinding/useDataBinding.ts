import { useVariableStore } from "@/stores/variables";
import { useInputsStore } from "@/stores/inputs";
import { useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Component } from "@/utils/editor";
import { pick } from "next/dist/lib/pick";
import get from "lodash.get";
import { ComputeValuePropCtx, ComputeValueProps } from "@/types/dataBinding";

const parseVariableValue = (value: string): any => {
  try {
    return JSON.parse(value);
  } catch (_) {
    return value;
  }
};

export const useDataBinding = () => {
  const browser = useRouter();
  const computeValue: ComputeValueProps = (
    { value, shareableContent, staticFallback },
    ctx,
  ) => {
    const variablesList = useVariableStore.getState().variableList;
    const inputsStore = useInputsStore.getState().inputValues;
    const auth = useDataSourceStore.getState().getAuthState();

    const autoRunJavascriptCode = <T>(
      boundCode: string,
      ctx?: ComputeValuePropCtx,
    ): T | undefined => {
      const { actions } = ctx ?? {};

      try {
        const result = eval(`(function () { ${boundCode} })`)();
        return result;
      } catch (error: any) {
        //console.error(error);
        return;
      }
    };

    const allInputComponents = Object.values(
      useEditorTreeStore.getState().componentMutableAttrs,
    ).reduce((acc, c) => {
      const isInput = [
        "Input",
        "Select",
        "Checkbox",
        "RadioGroup",
        "Switch",
        "Textarea",
        "Autocomplete",
        "DateInput",
      ].includes(c?.name!);
      if (isInput) {
        acc.push({ id: c.id, description: c.name });
      }
      return acc;
    }, [] as Partial<Component>[]);

    const variables = variablesList.reduce(
      (acc, variable) => {
        const value = variable.value ?? variable.defaultValue ?? "";

        const parsedValue =
          ["ARRAY", "OBJECT"].includes(variable.type) &&
          typeof value === "string"
            ? parseVariableValue(value)
            : value;

        acc.list[variable.id] = variable;
        acc[variable.id] = parsedValue;
        acc[variable.name] = parsedValue;
        return acc;
      },
      { list: {} } as any,
    );

    const components = allInputComponents.reduce(
      (acc, component) => {
        const value = inputsStore[component?.id!];
        component = { ...component, name: component.description! };
        acc.list[component?.id!] = component;
        acc[component?.id!] = value;
        return acc;
      },
      { list: {} } as any,
    );

    const browserList = Array.of(
      pick(browser, ["asPath", "basePath", "pathname", "query", "route"]),
    );

    if (value === undefined) return staticFallback || "";
    let dataType = value?.dataType ?? "static";

    const valueHandlers = {
      dynamic: () => {
        return get(shareableContent, `data.${value?.dynamic}`, value?.dynamic);
      },
      static: () => {
        return get(value, "static", staticFallback);
      },
      boundCode: () => {
        let boundCode = value?.boundCode?.trim() ?? "";

        return autoRunJavascriptCode(boundCode, ctx);
      },
    };

    return valueHandlers[dataType]();
  };

  return { computeValue };
};
