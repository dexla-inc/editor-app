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

    const variables = variablesList.reduce(
      (acc, variable) => {
        const value = variable.value ?? variable.defaultValue ?? "";
        const variableHandler = {
          TEXT: () => (value ? value : undefined),
          BOOLEAN: () =>
            typeof value === "boolean" ? value : JSON.parse(value),
          NUMBER: () => safeJsonParse(value),
          OBJECT: () => JSON.stringify(value),
          ARRAY: () => value,
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
          const { dataType = "static" } = c.onLoad?.value ?? {};
          acc[c?.id!] = valueHandlers[dataType as keyof typeof valueHandlers](
            c.onLoad?.value,
          );
        }
        return acc;
      },
      { list: {} } as any,
    );

    if (value === undefined) return staticFallback || "";
    let dataType = value?.dataType ?? "static";

    return valueHandlers[dataType](value);
  };

  return { computeValue };
};
