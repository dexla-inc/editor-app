import { useVariableStore } from "@/stores/variables";
import { useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { pick } from "next/dist/lib/pick";
import get from "lodash.get";
import {
  ComputeValuePropCtx,
  ComputeValueProps,
  ValueProps,
} from "@/types/dataBinding";
import { safeJsonParse } from "@/utils/common";
import { useInputsStore } from "@/stores/inputs";
import { Component } from "@/utils/editor";

export const useDataBinding = () => {
  const browser = useRouter();
  const computeValue: ComputeValueProps = (
    { value, shareableContent, staticFallback },
    ctx,
  ) => {
    const valueHandlers = {
      dynamic: function (value: ValueProps) {
        return get(shareableContent, `data.${value?.dynamic}`, value?.dynamic);
      },
      static: function (value: ValueProps) {
        return get(value, "static", staticFallback);
      },
      boundCode: function (value: ValueProps) {
        let boundCode = value?.boundCode?.trim() ?? "";

        return autoRunJavascriptCode(boundCode, ctx);
      },
    };

    const variablesList = useVariableStore.getState().variableList;
    const inputsStore = useInputsStore.getState().inputValues;
    const auth = useDataSourceStore.getState().getAuthState();

    const allInputComponents = Object.values(
      useEditorTreeStore.getState().componentMutableAttrs,
    ).reduce((acc, c) => {
      const isInput = [
        "Input",
        "Select",
        "Checkbox",
        "CheckboxGroup",
        "Radio",
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

    const variables = variablesList.reduce(
      (acc, variable) => {
        const value = variable.value ?? variable.defaultValue ?? undefined;
        const variableHandler = {
          TEXT: () => value,
          BOOLEAN: () =>
            typeof value === "boolean" ? value : safeJsonParse(value),
          NUMBER: () => safeJsonParse(value),
          OBJECT: () => safeJsonParse(value),
          ARRAY: () => safeJsonParse(value),
        };

        const parsedValue =
          variableHandler[variable.type as keyof typeof variableHandler]?.();

        acc.list[variable.id] = variable;
        acc[variable.id] = parsedValue;
        acc[variable.name] = parsedValue;
        return acc;
      },
      { list: {} } as any,
    );

    const browserList = Array.of(
      pick(browser, ["asPath", "basePath", "pathname", "query", "route"]),
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

    if (value === undefined) return staticFallback || "";
    let dataType = value?.dataType ?? "static";

    const result = valueHandlers[dataType](value);

    return result;
  };

  return { computeValue };
};
