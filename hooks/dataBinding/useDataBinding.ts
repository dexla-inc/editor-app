import { useVariableStore } from "@/stores/variables";
import { useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
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

    const components = Object.values(
      useEditorTreeStore.getState().componentMutableAttrs,
    ).reduce(
      (acc, c) => {
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
          acc.list[c?.id!] = {
            id: c.id,
            name: c.description,
            description: c.description,
          };
          acc[c?.id!] = c.onLoad?.value?.static;
        }
        return acc;
      },
      { list: {} } as any,
    );

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
    const test = valueHandlers[dataType]();
    return test;
  };

  return { computeValue };
};
