import { useVariableStore } from "@/stores/variables";
import { useInputsStore } from "@/stores/inputs";
import { useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Component } from "@/utils/editor";
import { pick } from "next/dist/lib/pick";
import get from "lodash.get";
import { ValueProps } from "@/utils/types";

export type GetValueProps = {
  value?: ValueProps;
  shareableContent?: any;
  staticFallback?: string;
};

const parseVariableValue = (value: string): any => {
  try {
    return JSON.parse(value);
  } catch (_) {
    return value;
  }
};

const processValue = (value: any, type: string) => {
  return type === "STRING" ? value.toString() : value;
};

export const useDataBinding = () => {
  const browser = useRouter();
  const computeValue = (
    { value, shareableContent, staticFallback }: GetValueProps,
    ctx?: any,
  ) => {
    const variablesList = useVariableStore.getState().variableList;
    const inputsStore = useInputsStore.getState().inputValues;
    const auth = useDataSourceStore.getState().getAuthState();

    const autoRunJavascriptCode = (boundCode: string, ctx: any) => {
      const { actions } = ctx ?? {};

      try {
        const result = eval(`(function () { ${boundCode} })`)();
        return result;
      } catch (error: any) {
        console.error(error);
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
      ].includes(c?.name!);
      if (isInput) {
        acc.push({ id: c.id, description: c.name });
      }
      return acc;
    }, [] as Partial<Component>[]);

    const variables = variablesList.reduce(
      (acc, variable) => {
        let value = variable.value ?? variable.defaultValue ?? "";
        const parsedValue = parseVariableValue(value);
        const processedValue = processValue(parsedValue, variable.type);

        acc.list[variable.id] = variable;
        acc[variable.id] = processedValue;
        acc[variable.name] = processedValue;
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

    if (value === undefined) return staticFallback || undefined;
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
