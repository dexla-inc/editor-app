import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableStore } from "@/stores/variables";
import { NextRouter, useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { memoize } from "proxy-memoize";
import { useCallback, useMemo } from "react";
import get from "lodash.get";
import { ValueProps } from "@/types/dataBinding";
import { pick } from "next/dist/lib/pick";
import set from "lodash.set";
import transform from "lodash.transform";
import { safeJsonParse } from "@/utils/common";

type NextRouterKeys = keyof NextRouter;
type RecordStringAny = Record<string, any>;

const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const componentPattern = /components\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const actionPattern = /actions\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const browserPattern = /browser\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const authPattern = /auth\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;

type UseComputeValue = {
  shareableContent?: Record<string, unknown>;
  onLoad: any;
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

const findValuePropsPaths = (obj: any, prefix = ""): string[] => {
  let paths: string[] = [];
  Object.keys(obj).forEach((key) => {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if ("dataType" in obj[key]) {
        paths.push(fullPath);
      } else {
        paths = [...paths, ...findValuePropsPaths(obj[key], fullPath)];
      }
    }
  });
  return paths;
};

export const useComputeValue2 = ({
  shareableContent,
  onLoad,
}: UseComputeValue) => {
  const browser = useRouter();
  const valuePropsPaths = useMemo(() => {
    return findValuePropsPaths(onLoad);
  }, [onLoad]);

  const { variableKeys, componentKeys, actionKeys, browserKeys, authKeys } =
    useMemo(() => {
      const variableKeys: any[] = [];
      const componentKeys: any[] = [];
      const actionKeys: any[] = [];
      const browserKeys: NextRouterKeys[] = [];
      const authKeys: any[] = [];

      valuePropsPaths.forEach((fieldValuePath) => {
        const fieldValue = get(onLoad, fieldValuePath);
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
      });

      return { variableKeys, componentKeys, actionKeys, browserKeys, authKeys };
    }, [onLoad, valuePropsPaths]);

  const variables = useVariableStore(
    memoize((state) =>
      variableKeys.reduce((acc, key) => {
        const variable = state.variableList.find((v) => v.id === key);
        const variableValue =
          variable?.value ?? variable?.defaultValue ?? undefined;
        const variableHandler = {
          TEXT: () => `\`${variableValue}\``,
          BOOLEAN: () =>
            typeof variableValue === "boolean"
              ? variableValue
              : safeJsonParse(variableValue),
          NUMBER: () => safeJsonParse(variableValue),
          OBJECT: () => variableValue,
          ARRAY: () => variableValue,
        };

        if (variable) {
          const value =
            variableHandler[variable.type as keyof typeof variableHandler]() ??
            `undefined`;

          return {
            ...acc,
            [key]: value,
          };
        }

        return acc;
      }, {}),
    ),
  ) as RecordStringAny;

  const inputs = useEditorTreeStore(
    memoize((state) =>
      transform(
        pick(state.componentMutableAttrs, componentKeys),
        (acc, value) => {
          acc[value?.id!] = value?.onLoad?.value?.static ?? "";
        },
        {} as RecordStringAny,
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

  const transformBoundCode = useCallback(
    (boundCode: string) => {
      let result = boundCode;
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
    },
    [
      actionKeys,
      auth,
      authKeys,
      browserKeys,
      browserValues,
      componentKeys,
      inputs,
      variableKeys,
      variables,
    ],
  );

  const valueHandlers = useMemo(
    () => ({
      dynamic: (fieldValue: ValueProps) => {
        return get(
          shareableContent,
          `data.${fieldValue?.dynamic}`,
          fieldValue?.dynamic,
        );
      },
      static: (fieldValue: ValueProps) => {
        return get(fieldValue, "static");
      },
      boundCode: (fieldValue: ValueProps) => {
        try {
          const boundCode = transformBoundCode(fieldValue.boundCode ?? "");
          return autoRunJavascriptCode(boundCode);
        } catch {
          return;
        }
      },
    }),
    [shareableContent, transformBoundCode],
  );

  return valuePropsPaths.reduce(
    (acc, fieldValuePath) => {
      const fieldValue = get(onLoad, fieldValuePath);
      const { dataType } = fieldValue;

      set(
        acc,
        fieldValuePath,
        valueHandlers[dataType as keyof typeof valueHandlers]?.(fieldValue),
      );

      return acc;
    },
    onLoad as Record<string, any>,
  );
};
