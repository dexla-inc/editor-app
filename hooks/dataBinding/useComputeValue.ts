import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableStore } from "@/stores/variables";
import { useInputsStore } from "@/stores/inputs";
import { NextRouter, useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { memoize } from "proxy-memoize";
import { useMemo } from "react";
import get from "lodash.get";
import { ValueProps } from "@/utils/types";

type NextRouterKeys = keyof NextRouter;
type RecordStringAny = Record<string, any>;

const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const componentPattern = /components\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const actionPattern = /actions\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const browserPattern = /browser\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const authPattern = /auth\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;

type UseComputeValue = {
  componentId: string;
  field: string;
  shareableContent: Record<string, unknown>;
  staticFallback?: string;
};

const autoRunJavascriptCode = (boundCode: string) => {
  try {
    const result = new Function(boundCode)();
    return result;
  } catch (error: any) {
    console.error(error);
    return;
  }
};

export const useComputeValue = ({
  componentId,
  field,
  shareableContent,
  staticFallback,
}: UseComputeValue) => {
  const browser = useRouter();
  const fieldValue = useEditorTreeStore(
    memoize(
      (state) =>
        state.componentMutableAttrs[componentId]?.onLoad?.[field] ?? {},
    ),
  ) as ValueProps;

  const { variableKeys, componentKeys, actionKeys, browserKeys, authKeys } =
    useMemo(() => {
      const variableKeys = [];
      const componentKeys = [];
      const actionKeys = [];
      const browserKeys: NextRouterKeys[] = [];
      const authKeys = [];

      if (fieldValue.dataType === "boundCode" && fieldValue.boundCode) {
        variableKeys.push(
          ...[...fieldValue.boundCode.matchAll(variablePattern)].map(
            (match) => match[1],
          ),
        );
        componentKeys.push(
          ...[...fieldValue.boundCode.matchAll(componentPattern)].map(
            (match) => match[1],
          ),
        );
        actionKeys.push(
          ...[...fieldValue.boundCode.matchAll(actionPattern)].map(
            (match) => match[1],
          ),
        );
        browserKeys.push(
          // @ts-ignore
          ...[...fieldValue.boundCode.matchAll(browserPattern)].map(
            (match) => match[1],
          ),
        );
        authKeys.push(
          ...[...fieldValue.boundCode.matchAll(authPattern)].map(
            (match) => match[1],
          ),
        );
      }

      return { variableKeys, componentKeys, actionKeys, browserKeys, authKeys };
    }, [fieldValue]);

  const variables = useVariableStore(
    memoize((state) =>
      variableKeys.reduce((acc, key) => {
        const variable = state.variableList.find((v) => v.id === key);

        if (variable) {
          const value =
            variable.type === "TEXT" ? `'${variable.value}'` : variable.value;

          return {
            ...acc,
            [key]: value ?? "",
          };
        }

        return acc;
      }, {}),
    ),
  ) as RecordStringAny;

  const inputs = useInputsStore(
    memoize((state) =>
      componentKeys.reduce(
        (acc, key) => ({ ...acc, [key]: state.inputValues[key] ?? "" }),
        {},
      ),
    ),
  ) as RecordStringAny;

  const auth = useDataSourceStore(
    memoize((state) =>
      authKeys.reduce(
        (acc, key) => ({
          ...acc,
          // @ts-ignore
          [key]: state.getAuthState()[key],
        }),
        {},
      ),
    ),
  ) as RecordStringAny;
  const browserValues: any = useMemo(() => {
    return browserKeys.reduce(
      (acc, key) => ({ ...acc, [key]: browser[key] }),
      {},
    );
  }, [browser, browserKeys]);

  const boundCodeTransformed = useMemo(() => {
    if (fieldValue.dataType === "boundCode") {
      let result = fieldValue.boundCode ?? "";

      variableKeys.forEach((key) => {
        const regex = new RegExp(
          `variables\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        result = result.replaceAll(regex, variables[key]);
      });

      componentKeys.forEach((key) => {
        const regex = new RegExp(
          `components\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        result = result.replaceAll(regex, `'${inputs[key]}'`);
      });

      actionKeys.forEach((key) => {
        const regex = new RegExp(
          `actions\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        result = result.replaceAll(regex, `'${inputs[key]}'`);
      });

      browserKeys.forEach((key: NextRouterKeys) => {
        const regex = new RegExp(
          `browser\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        result = result.replaceAll(regex, `'${browserValues[key]}'`);
      });

      authKeys.forEach((key) => {
        const regex = new RegExp(
          `auth\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        result = result.replaceAll(regex, `'${auth[key]}'`);
      });

      return result;
    }
  }, [
    fieldValue,
    variables,
    inputs,
    browserValues,
    browserKeys,
    componentKeys,
    actionKeys,
    variableKeys,
    authKeys,
    auth,
  ]);

  // console.log("boundCodeTransformed", boundCodeTransformed);

  const valueHandlers = useMemo(
    () => ({
      dynamic: () => {
        return get(
          shareableContent,
          `data.${fieldValue?.dynamic}`,
          fieldValue?.dynamic,
        );
      },
      static: () => {
        return get(fieldValue, "static", staticFallback);
      },
      boundCode: () => {
        return autoRunJavascriptCode(boundCodeTransformed ?? "");
      },
    }),
    [fieldValue, shareableContent, staticFallback, boundCodeTransformed],
  );

  return fieldValue && fieldValue.dataType
    ? valueHandlers[fieldValue.dataType]()
    : staticFallback;
};
