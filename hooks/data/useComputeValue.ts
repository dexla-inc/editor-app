import { useVariableStore } from "@/stores/variables";
import { NextRouter, useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { useCallback, useMemo } from "react";
import get from "lodash.get";
import { ValueProps } from "@/types/dataBinding";
import set from "lodash.set";
import { safeJsonParse } from "@/utils/common";
import cloneDeep from "lodash.clonedeep";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";
import { relatedKeys } from "@/utils/data";

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
}: UseComputeValue) => {
  onLoad = cloneDeep(onLoad);

  const browser = useRouter();
  const valuePropsPaths = useMemo(() => {
    return findValuePropsPaths(onLoad);
  }, [onLoad]);

  const relatedComponentsDataList = Object.entries(
    shareableContent?.relatedComponentsData ?? {},
  );
  const itemData = relatedComponentsDataList?.at(-1);

  const item = cloneDeep(relatedComponentsDataList)
    ?.reverse()
    .reduce(
      (acc, [key, value], i) => {
        acc[relatedKeys[i]] = value;
        return acc;
      },
      {
        index: itemData?.[0]?.split("__")?.[1],
      } as any,
    );

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
          NUMBER: () => safeJsonParse(variableValue), // Parse number safely
          OBJECT: () => variableValue,
          ARRAY: () => variableValue,
        };

        const value =
          variableHandler[variable.type as keyof typeof variableHandler]?.() ??
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

  const itemValues: any = itemKeys.reduce(
    (acc, key) => ({ ...acc, [key]: JSON.stringify(item[key]) }),
    {},
  );

  const transformBoundCode = useCallback(
    (boundCode: string) => {
      let result = boundCode;
      variableKeys.forEach((key) => {
        const regex = new RegExp(
          `variables\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        let replacer = variables[key];
        replacer =
          typeof replacer !== "string" ? JSON.stringify(replacer) : replacer;
        result = result.replaceAll(regex, replacer);
      });

      componentKeys.forEach((key) => {
        const regex = new RegExp(
          `components\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        let replacer = inputs[key];
        replacer =
          typeof replacer !== "string" ? JSON.stringify(replacer) : replacer;
        result = result.replaceAll(regex, replacer);
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
        let replacer = browserValues[key];
        replacer =
          typeof replacer !== "string" ? JSON.stringify(replacer) : replacer;
        result = result.replaceAll(regex, replacer);
      });

      authKeys.forEach((key) => {
        const regex = new RegExp(
          `auth\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        let replacer = auth[key];
        replacer =
          typeof replacer !== "string" ? JSON.stringify(replacer) : replacer;
        result = result.replaceAll(regex, replacer);
      });

      itemKeys.forEach((key) => {
        const regex = new RegExp(
          `item\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        let replacer = itemValues[key];
        replacer =
          typeof replacer !== "string" ? JSON.stringify(replacer) : replacer;
        result = result.replaceAll(regex, replacer);
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
      itemKeys,
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
    [onLoad, valueHandlers, valuePropsPaths],
  );
};

function extractKeysFromPattern(pattern: RegExp, boundCode: any) {
  return [...boundCode.matchAll(pattern)].map((match) => match[1]);
}
