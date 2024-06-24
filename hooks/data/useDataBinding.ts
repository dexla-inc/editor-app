import { useVariableStore } from "@/stores/variables";
import { useDataSourceStore } from "@/stores/datasource";
import { pick } from "next/dist/lib/pick";
import get from "lodash.get";
import {
  ComputeValuePropCtx,
  GetValueProps,
  RuleItemProps,
  RuleProps,
  ValueProps,
} from "@/types/dataBinding";
import { safeJsonParse } from "@/utils/common";
import { useInputsStore } from "@/stores/inputs";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import isEmpty from "lodash.isempty";
import { ruleFunctions } from "@/hooks/data/useComputeValue";

export const useDataBinding = (componentId = "") => {
  const browser = useOldRouter();
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
      rules: function (value: ValueProps) {
        return evaluateRules(value?.rules!);
      },
    };

    const variablesList = Object.values(
      useVariableStore.getState().variableList,
    );

    const projectId = useEditorTreeStore.getState().currentProjectId as string;
    const language = useEditorTreeStore.getState().language as string;

    const auth = useDataSourceStore.getState().getAuthState(projectId);
    const others = {
      auth,
      browser: pick(browser, ["asPath", "query"]),
      language,
    };
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
      const { actions, event, item } = ctx ?? {};

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

    function evaluateCondition(rule: RuleItemProps) {
      let overallResult = null;

      const { conditions } = rule;

      for (let i = 0; i < conditions?.length; i++) {
        let { value, rule, location } = conditions[i];
        if (isEmpty(rule) || isEmpty(location)) {
          continue;
        }
        const transformedValue =
          valueHandlers[value?.dataType ?? "static"](value);
        location = autoRunJavascriptCode(location)!;

        // Evaluate the rule
        const ruleFunction = ruleFunctions[rule];
        const ruleResult = ruleFunction(location, transformedValue);

        if (i === 0) {
          // Initialize overallResult with the first rule's result
          overallResult = ruleResult;
        } else {
          // Apply the previous operator with the previous overallResult
          const prevOperator = conditions[i - 1].operator;
          if (prevOperator === "and") {
            overallResult = overallResult && ruleResult;
          } else if (prevOperator === "or") {
            overallResult = overallResult || ruleResult;
          }
        }
      }

      return overallResult;
    }

    function evaluateRules(rules: RuleProps) {
      const rulesList = rules?.rules;

      if (!rulesList?.length) {
        return valueHandlers.boundCode(rules.value);
      }

      for (const rule of rules.rules) {
        const ruleResult = evaluateCondition(rule);
        if (ruleResult) {
          return valueHandlers[rule.result?.dataType ?? "static"](rule.result);
        }
      }
      return;
    }

    if (value === undefined) return staticFallback || "";
    const result = valueHandlers[value?.dataType ?? "static"](value);

    return result;
  }

  return { computeValue };
};
