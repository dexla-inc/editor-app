import { useVariableStore } from "@/stores/variables";
import { NextRouter, useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { useCallback, useMemo } from "react";
import get from "lodash.get";
import { ValueProps } from "@/types/dataBinding";
import set from "lodash.set";
import { cloneObject, safeJsonParse } from "@/utils/common";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";
import { useShareableContent } from "@/hooks/data/useShareableContent";
import { useEditorTreeStore } from "@/stores/editorTree";

type NextRouterKeys = keyof NextRouter;
type RecordStringAny = Record<string, any>;

const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const componentPattern = /components\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const actionPattern = /actions\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const browserPattern = /browser\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const authPattern = /auth\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const itemPattern = /item\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;

type UseComputeValue = {
  shareableContent?: Record<string, unknown>;
  onLoad: any;
  componentId?: string;
};

const autoRunJavascriptCode = (boundCode: string) => {
  try {
    const result = new Function(boundCode)();
    return result;
  } catch (error: any) {
    return;
  }
};

const findValuePropsPaths = (obj: any, prefix = ""): string[] => {
  let paths: string[] = [];
  Object.keys(obj).forEach((key) => {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (
        "dataType" in obj[key] ||
        "boundCode" in obj[key] ||
        "dynamic" in obj[key] ||
        "static" in obj[key]
      ) {
        paths.push(fullPath);
      } else {
        paths = [...paths, ...findValuePropsPaths(obj[key], fullPath)];
      }
    }
  });
  return paths;
};

export const useComputeValue = ({
  shareableContent,
  onLoad = {},
  componentId = "",
}: UseComputeValue) => {
  onLoad = cloneObject(onLoad);

  const browser = useRouter();

  // TODO: PERFORMANCE BUG! useMemo was not neccessary if we are cloning onLoad because the dependency onLoad will always be a new object
  const valuePropsPaths = findValuePropsPaths(onLoad);
  const { item } = useShareableContent({ componentId });

  const {
    variableKeys,
    componentKeys,
    actionKeys,
    browserKeys,
    authKeys,
    itemKeys,
  } = useMemo(() => {
    const variableKeys: any[] = [];
    const componentKeys: any[] = [];
    const actionKeys: any[] = [];
    const browserKeys: NextRouterKeys[] = [];
    const authKeys: any[] = [];
    const itemKeys: any[] = [];

    const patterns = [
      { pattern: variablePattern, keys: variableKeys },
      { pattern: componentPattern, keys: componentKeys },
      { pattern: actionPattern, keys: actionKeys },
      { pattern: browserPattern, keys: browserKeys },
      { pattern: authPattern, keys: authKeys },
      { pattern: itemPattern, keys: itemKeys },
    ];

    valuePropsPaths.forEach((fieldValuePath) => {
      const fieldValue = get(onLoad, fieldValuePath);
      if (fieldValue.dataType === "boundCode" && fieldValue.boundCode) {
        patterns.forEach(({ pattern, keys }) => {
          keys.push(...extractKeysFromPattern(pattern, fieldValue.boundCode));
        });
      }
    });

    return {
      variableKeys: [...new Set(variableKeys)],
      componentKeys: [...new Set(componentKeys)],
      actionKeys: [...new Set(actionKeys)],
      browserKeys: [...new Set(browserKeys)],
      authKeys: [...new Set(authKeys)],
      itemKeys: [...new Set(itemKeys)],
    };
  }, [onLoad, valuePropsPaths]);

  const rawVariables = useVariableStore(
    useShallow((state) => pick(state.variableList, variableKeys)),
  ) as RecordStringAny;

  const variables: RecordStringAny = useMemo(
    () =>
      Object.entries(rawVariables).reduce((acc, [key, variable]) => {
        const variableValue =
          variable?.value ?? variable?.defaultValue ?? undefined;
        const variableHandler = {
          TEXT: () => `\`${variableValue}\``, // Template literals for text
          BOOLEAN: () =>
            typeof variableValue === "boolean"
              ? variableValue
              : safeJsonParse(variableValue),
          NUMBER: () => safeJsonParse(variableValue),
          OBJECT: () => variableValue,
          ARRAY: () => variableValue,
        };

        const value =
          variableHandler[variable?.type as keyof typeof variableHandler]?.() ??
          "undefined";

        return {
          ...acc,
          [key]: value,
        };
      }, {}),
    [rawVariables],
  );

  const inputs = useInputsStore(
    useShallow((state) => pick(state.inputValues, componentKeys)),
  ) as RecordStringAny;

  const projectId = useEditorTreeStore.getState().currentProjectId as string;

  const auth = useDataSourceStore(
    useShallow((state) =>
      authKeys.reduce(
        (acc, key) => ({
          ...acc,
          // @ts-ignore
          [key]: state.getAuthState(projectId)?.[key] || {},
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

  const itemValues: any = itemKeys.reduce(
    (acc, key) => ({ ...acc, [key]: JSON.stringify(item[key]) }),
    {},
  );

  // TODO: Perforformance Bug! We are compiling regular expressions inside the loop, compile them once outside the loop and reuse them.
  // TODO: Perforformance Bug! JSON stringify operations are costly. Avoid them if the value is already a string.
  const transformBoundCode = useCallback(
    (boundCode: string): string => {
      let result = boundCode;

      const variablePatterns = compileRegexPatterns(variableKeys, "variables");
      const componentPatterns = compileRegexPatterns(
        componentKeys,
        "components",
      );
      const actionPatterns = compileRegexPatterns(actionKeys, "actions");
      const browserPatterns = compileRegexPatterns(browserKeys, "browser");
      const authPatterns = compileRegexPatterns(authKeys, "auth");
      const itemPatterns = compileRegexPatterns(itemKeys, "item");

      result = replacePatterns(result, variablePatterns, variables);
      result = replacePatterns(result, componentPatterns, inputs);
      result = replacePatterns(result, actionPatterns, inputs);
      result = replacePatterns(result, browserPatterns, browserValues);
      result = replacePatterns(result, authPatterns, auth);
      result = replacePatterns(result, itemPatterns, itemValues);

      return result;
    },
    [
      variableKeys,
      componentKeys,
      actionKeys,
      browserKeys,
      authKeys,
      itemKeys,
      variables,
      inputs,
      browserValues,
      auth,
      itemValues,
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

  // TODO: PERFORMANCE BUG! useMemo is not neccessary if we are cloning onLoad because the dependency onLoad will
  // always be a new object
  return useMemo(
    () =>
      valuePropsPaths.reduce(
        (acc, fieldValuePath) => {
          const fieldValue = get(onLoad, fieldValuePath);
          const { dataType = "static" } = fieldValue ?? {};

          set(
            acc,
            fieldValuePath,
            valueHandlers[dataType as keyof typeof valueHandlers]?.(fieldValue),
          );

          return acc;
        },
        onLoad as Record<string, any>,
      ),
    [valueHandlers, valuePropsPaths],
  );
};

function extractKeysFromPattern(pattern: RegExp, boundCode: any) {
  return [...boundCode.matchAll(pattern)].map((match) => match[1]);
}

const compileRegexPatterns = (keys: string[], prefix: string): Pattern[] => {
  return keys.map((key) => ({
    key,
    regex: new RegExp(
      `${prefix}\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
      "g",
    ),
  }));
};

const replacePatterns = (
  result: string,
  patterns: Pattern[],
  values: Record<string, any>,
): string => {
  patterns.forEach(({ key, regex }) => {
    let replacer = values[key];
    if (typeof replacer !== "string") {
      replacer = JSON.stringify(replacer);
    }
    result = result.replace(regex, replacer);
  });
  return result;
};

type Pattern = {
  key: string;
  regex: RegExp;
};
