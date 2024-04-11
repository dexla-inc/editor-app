import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableStore } from "@/stores/variables";
import { NextRouter, useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { useMemo } from "react";
import get from "lodash.get";
import { ValueProps } from "@/types/dataBinding";
import { safeJsonParse } from "@/utils/common";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";

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
  staticFallback?: string | number | boolean | Record<string, unknown>;
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
    useShallow(
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
    useShallow((state) =>
      variableKeys.reduce((acc, key) => {
        const variable = state.variableList.find((v) => v.id === key);
        const value = variable?.value ?? variable?.defaultValue ?? undefined;
        const variableHandler = {
          TEXT: () => `\`${value}\``,
          BOOLEAN: () =>
            typeof value === "boolean" ? value : JSON.parse(value),
          NUMBER: () => safeJsonParse(value),
          OBJECT: () => value,
          ARRAY: () => value,
        };

        if (variable) {
          const value =
            variableHandler[variable.type as keyof typeof variableHandler]();

          return {
            ...acc,
            [key]: value,
          };
        }

        return acc;
      }, {}),
    ),
  ) as RecordStringAny;

  const inputs = useInputsStore(
    useShallow((state) => pick(state.inputValues, componentKeys)),
  ) as RecordStringAny;

  const auth = useDataSourceStore(
    useShallow((state) =>
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
        try {
          return autoRunJavascriptCode(boundCodeTransformed ?? "");
        } catch {
          return;
        }
      },
    }),
    [fieldValue, shareableContent, staticFallback, boundCodeTransformed],
  );

  return fieldValue && fieldValue.dataType
    ? valueHandlers[fieldValue.dataType]()
    : staticFallback;
};
