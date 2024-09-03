import { useDataTransformers } from "@/hooks/data/useDataTransformers";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import { useRuleHandler } from "@/hooks/data/useRuleHandler";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { ValueProps } from "@/types/dataBinding";
import { cloneObject, emptyObject, safeJsonParse } from "@/utils/common";
import get from "lodash.get";
import has from "lodash.has";
import set from "lodash.set";
import { pick } from "next/dist/lib/pick";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

type RecordStringAny = Record<string, any>;

const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const componentPattern = /components\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
const actionPattern = /actions\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;
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

// get all ValueProps paths + if it finds the rules property, it looks for nested ValueProps within rules and return them.
const findValuePropsPaths = (obj: any, prefix = ""): string[] => {
  let paths: string[] = [];
  Object.keys(obj).forEach((key) => {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (typeof value === "object" && value !== null) {
      if (
        "dataType" in value ||
        "boundCode" in value ||
        "dynamic" in value ||
        "static" in value ||
        "rules" in value
      ) {
        paths.push(fullPath);
      }
      if (Array.isArray(value) && key === "rules") {
        value.forEach((condition, index) => {
          if (typeof condition === "object" && condition !== null) {
            paths = [
              ...paths,
              ...findValuePropsPaths(condition, `${fullPath}[${index}]`),
            ];
          }
        });
      } else {
        paths = [...paths, ...findValuePropsPaths(value, fullPath)];
      }
    }
  });
  return paths;
};

export const useComputeValue = ({
  shareableContent,
  onLoad = {},
}: UseComputeValue) => {
  const rulesHandler = useRuleHandler();
  const { itemTransformer } = useDataTransformers();
  onLoad = cloneObject(onLoad);

  const browser = useOldRouter();
  const valuePropsPaths = useMemo(() => {
    return findValuePropsPaths(onLoad);
  }, [onLoad]);

  const item = itemTransformer(shareableContent?.relatedComponentsData ?? {});

  const { variableKeys, componentKeys, actionKeys, itemKeys, otherKeys } =
    useMemo(() => {
      const variableKeys: any[] = [];
      const componentKeys: any[] = [];
      const actionKeys: any[] = [];
      const otherKeys: any[] = [];
      const itemKeys: any[] = [];

      const patterns = [
        { pattern: variablePattern, keys: variableKeys },
        { pattern: componentPattern, keys: componentKeys },
        { pattern: actionPattern, keys: actionKeys },
        { pattern: otherPattern, keys: otherKeys },
        { pattern: itemPattern, keys: itemKeys },
      ];

      valuePropsPaths.forEach((fieldValuePath) => {
        const fieldValue = get(onLoad, fieldValuePath) as ValueProps;
        if (fieldValue.dataType === "boundCode" && fieldValue.boundCode) {
          patterns.forEach(({ pattern, keys }) => {
            keys.push(...extractKeysFromPattern(pattern, fieldValue.boundCode));
          });
        }
        if (
          fieldValue.dataType === "rules" &&
          fieldValue.rules?.rules?.length
        ) {
          fieldValue.rules?.rules?.forEach((rule) => {
            rule.conditions.forEach((condition) => {
              patterns.forEach(({ pattern, keys }) => {
                keys.push(
                  ...extractKeysFromPattern(pattern, condition.location ?? ""),
                );
              });
            });
          });
        }
      });

      return {
        variableKeys: [...new Set(variableKeys)],
        componentKeys: [...new Set(componentKeys)],
        actionKeys: [...new Set(actionKeys)],
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

  const auth = useDataSourceStore((state) =>
    state.getAuthState(projectId),
  ) as RecordStringAny;

  const otherValues = useEditorTreeStore(
    useShallow((state) => {
      return { language: state.language, browser, auth };
    }),
  ) as RecordStringAny;

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
        let replacer = JSON.stringify(inputs[key]);

        result = result.replaceAll(regex, replacer);
      });

      otherKeys.forEach((key) => {
        const regex = new RegExp(
          `others\\[(\\/\\* [\\S\\s]* \\*\\/)?\\s?'${key}'\\]`,
          "g",
        );
        let replacer = otherValues[key];
        replacer =
          typeof replacer !== "string"
            ? JSON.stringify(replacer)
            : `'${replacer}'`;
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

  const valueHandlers = {
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
    rules: (fieldValue: ValueProps) => {
      const evaluateRules = rulesHandler({
        valueHandlers,
      });
      const result = evaluateRules(fieldValue.rules!);
      return result;
    },
  };

  return useMemo(
    () =>
      valuePropsPaths.reduce(
        (acc, fieldValuePath) => {
          const fieldValue = get(onLoad, fieldValuePath);
          const { dataType = "static" } = fieldValue ?? {};

          // as the rules nested properties are mapped within valuePropsPaths (because rules contain condition -> ValueProps)
          // we want to ignore these nested props and use the first parent ValueProps, so that an entire set of conditions
          // in rules are turned into a single value
          if (fieldValuePath.search("rules") === -1) {
            set(
              acc,
              fieldValuePath,
              valueHandlers[dataType as keyof typeof valueHandlers]?.(
                fieldValue,
              ),
            );
          }

          return acc;
        },
        onLoad as Record<string, any>,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onLoad, valuePropsPaths],
  );
};

function extractKeysFromPattern(pattern: RegExp, boundCode: any) {
  return [...boundCode.matchAll(pattern)].map((match) => match[1]);
}
