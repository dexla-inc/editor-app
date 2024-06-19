import { useVariableStore } from "@/stores/variables";
import { useDataSourceStore } from "@/stores/datasource";
import { useCallback, useMemo } from "react";
import get from "lodash.get";
import { ValueProps } from "@/types/dataBinding";
import set from "lodash.set";
import { cloneObject, emptyObject, safeJsonParse } from "@/utils/common";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import { useDataTransformers } from "@/hooks/data/useDataTransformers";
import has from "lodash.has";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";

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

const findValuePropsPaths = (obj: any, prefix = ""): string[] => {
  let paths: string[] = [];
  Object.keys(obj).forEach((key) => {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (
        "dataType" in obj[key] ||
        "boundCode" in obj[key] ||
        "dynamic" in obj[key] ||
        "static" in obj[key] ||
        "rules" in obj[key]
      ) {
        paths.push(fullPath);
      } else {
        paths = [...paths, ...findValuePropsPaths(obj[key], fullPath)];
      }
    }
  });
  return paths;
};

export const ruleFunctions: any = {
  hasValue: (location: any) => location !== undefined,
  doesNotHaveValue: (location: any) => location === undefined,
  equalTo: (location: any, comparingValue: any) => location === comparingValue,
  notEqualTo: (location: any, comparingValue: any) =>
    location !== comparingValue,
  contains: (location: any, comparingValue: any) =>
    location.includes(comparingValue),
  notContains: (location: any, comparingValue: any) =>
    !location.includes(comparingValue),
  equalToMultiple: (location: any, comparingValue: any) =>
    isEqual(location, comparingValue),
  notEqualToMultiple: (location: any, comparingValue: any) =>
    isEqual(location, comparingValue),
};

export const useComputeValue = ({
  shareableContent,
  onLoad = {},
}: UseComputeValue) => {
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
        if (fieldValue.dataType === "rules" && fieldValue.rules?.length) {
          fieldValue.rules.forEach((rule) => {
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

  function evaluateCondition(condition: any) {
    let overallResult = null;

    const { conditions: rules, result } = condition;

    for (let i = 0; i < rules?.length; i++) {
      let { value, rule, location } = rules[i];
      if (isEmpty(rule) || isEmpty(location)) {
        continue;
      }
      const transformedLocation = transformBoundCode(
        `return ${location}` ?? "",
      );
      location = autoRunJavascriptCode(transformedLocation);

      // Evaluate the rule
      const ruleFunction = ruleFunctions[rule];
      const ruleResult = ruleFunction(location, value);

      if (i === 0) {
        // Initialize overallResult with the first rule's result
        overallResult = ruleResult;
      } else {
        // Apply the previous operator with the previous overallResult
        const prevOperator = rules[i - 1].operator;
        if (prevOperator === "and") {
          overallResult = overallResult && ruleResult;
        } else if (prevOperator === "or") {
          overallResult = overallResult || ruleResult;
        }
      }
    }

    return overallResult ? result : null;
  }

  function evaluateConditions(conditions: any) {
    for (const condition of conditions ?? []) {
      const conditionResult = evaluateCondition(condition);
      if (conditionResult) {
        return conditionResult;
      }
    }
    return null;
  }

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
      rules: (fieldValue: ValueProps) => {
        return evaluateConditions(fieldValue.rules);
      },
    }),
    [shareableContent, transformBoundCode, language, evaluateConditions],
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
