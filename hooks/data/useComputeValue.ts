import { useVariableStore } from "@/stores/variables";
import { useDataSourceStore } from "@/stores/datasource";
import { useCallback, useMemo } from "react";
import get from "lodash.get";
import { ValueProps } from "@/types/dataBinding";
import set from "lodash.set";
import { emptyObject, safeJsonParse } from "@/utils/common";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import { useDataTransformers } from "@/hooks/data/useDataTransformers";
import has from "lodash.has";
import cloneDeep from "lodash.clonedeep";

type NextRouterKeys = any;
type RecordStringAny = Record<string, any>;

const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const componentPattern = /components\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const actionPattern = /actions\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const browserPattern = /others\['browser'\]\.(.*)/g;
const authPattern = /others\['auth'\]\.(.*)/g;
const otherPattern = /others\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
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
  const { itemTransformer } = useDataTransformers();
  onLoad = cloneDeep(onLoad);

  const browser = useOldRouter();
  const valuePropsPaths = useMemo(() => {
    return findValuePropsPaths(onLoad);
  }, [onLoad]);

  const item = itemTransformer(shareableContent?.relatedComponentsData ?? {});

  const {
    variableKeys,
    componentKeys,
    actionKeys,
    browserKeys,
    authKeys,
    itemKeys,
    otherKeys,
  } = useMemo(() => {
    const variableKeys: any[] = [];
    const componentKeys: any[] = [];
    const actionKeys: any[] = [];
    const browserKeys: NextRouterKeys[] = [];
    const authKeys: any[] = [];
    const otherKeys: any[] = [];
    const itemKeys: any[] = [];

    const patterns = [
      { pattern: variablePattern, keys: variableKeys },
      { pattern: componentPattern, keys: componentKeys },
      { pattern: actionPattern, keys: actionKeys },
      { pattern: browserPattern, keys: browserKeys },
      { pattern: authPattern, keys: authKeys },
      { pattern: otherPattern, keys: otherKeys },
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
      otherKeys: [...new Set(otherKeys)],
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
  const language = useEditorTreeStore((state) => state.language);

  const auth = useDataSourceStore(
    useShallow((state) =>
      authKeys.reduce(
        (acc, key) => ({
          ...acc,
          // @ts-ignore
          [key]: sanitizedValue(state.getAuthState(projectId), key) || {},
        }),
        {},
      ),
    ),
  ) as RecordStringAny;

  const browserValues: any = useMemo(() => {
    return browserKeys.reduce(
      // @ts-ignore
      (acc, key) => ({ ...acc, [key]: sanitizedValue(browser, key) }),
      {},
    );
  }, [browser, browserKeys]);

  const itemValues: any = itemKeys.reduce(
    (acc, key) => ({ ...acc, [key]: JSON.stringify(item[key]) }),
    {},
  );

  const otherValues = useEditorTreeStore(
    useShallow((state) => {
      return otherKeys.reduce(
        (acc, key) => ({ ...acc, [key]: sanitizedValue(state, key) }),
        {},
      );
    }),
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
        let replacer = JSON.stringify(inputs[key]);

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
        const regex = new RegExp(`others\\['browser'\\]\\.${key}`, "g");
        result = result.replaceAll(regex, `'${browserValues[key]}'`);
      });

      authKeys.forEach((key) => {
        const regex = new RegExp(`others\\['auth'\\]\\.${key}`, "g");
        result = result.replaceAll(regex, `'${auth[key]}'`);
      });

      otherKeys.forEach((key) => {
        const regex = new RegExp(
          `others\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        result = result.replaceAll(regex, `'${otherValues[key]}'`);
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
      otherKeys,
      otherValues,
    ],
  );

  const valueHandlers = useMemo(
    () => ({
      dynamic: (fieldValue: ValueProps) => {
        return get(shareableContent, `data.${fieldValue?.dynamic}`);
      },
      static: (fieldValue: ValueProps) => {
        const staticValue = fieldValue?.static;
        const value = !has(staticValue, language)
          ? !has(staticValue, "en")
            ? emptyObject(staticValue)
              ? undefined
              : staticValue
            : // @ts-ignore
              staticValue?.en
          : staticValue?.[language];

        return value;
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
    [shareableContent, transformBoundCode, language],
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

const sanitizedValue = (data: any, key: string) => {
  const [first, ...rest] = key.split(".");
  return rest.length ? data[first]?.[rest.join(".")] : data[first];
};
