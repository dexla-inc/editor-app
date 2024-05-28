import { useVariableStore } from "@/stores/variables";
import { useDataSourceStore } from "@/stores/datasource";
import { pick } from "next/dist/lib/pick";
import get from "lodash.get";
import {
  ComputeValuePropCtx,
  GetValueProps,
  ValueProps,
} from "@/types/dataBinding";
import { safeJsonParse } from "@/utils/common";
import { useInputsStore } from "@/stores/inputs";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import { useShareableContent } from "@/hooks/data/useShareableContent";

export const useDataBinding = (componentId = "") => {
  const browser = useOldRouter();
  const { item } = useShareableContent({ componentId, computeValue });

  function computeValue<T>(
    { value, shareableContent, staticFallback }: GetValueProps,
    ctx: ComputeValuePropCtx,
  ): T | string {
    const valueHandlers = {
      dynamic: function (value: ValueProps) {
        return get(shareableContent, `data.${value?.dynamic}`, value?.dynamic);
      },
      static: function (value: ValueProps) {
        return value?.static ?? staticFallback;
      },
      boundCode: function (value: ValueProps) {
        let boundCode = value?.boundCode?.trim() ?? "";

        return autoRunJavascriptCode(boundCode, ctx);
      },
    };

    const variablesList = Object.values(
      useVariableStore.getState().variableList,
    );

    const projectId = useEditorTreeStore.getState().currentProjectId as string;

    const auth = useDataSourceStore.getState().getAuthState(projectId);

    const components = Object.entries(
      useInputsStore.getState().inputValues,
    ).reduce((acc, [componentGroupId, value]) => {
      acc[componentGroupId] = value;

      return acc;
    }, {} as any);

    const autoRunJavascriptCode = <T>(
      boundCode: string,
      ctx?: ComputeValuePropCtx,
    ): T | undefined => {
      const { actions, event } = ctx ?? {};

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

    const browserList = Array.of(pick(browser, ["asPath", "query"]));

    if (value === undefined) return staticFallback || "";
    let dataType = value?.dataType ?? "static";

    const result = valueHandlers[dataType](value);

    return result;
  }

  return { computeValue };
};
