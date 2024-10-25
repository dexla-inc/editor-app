import { isEmpty, safeJsonParse } from "@/utils/common";
import { RuleItemProps, RuleProps } from "@/types/dataBinding";

type RuleFunctionParams = {
  location: any;
  comparingValue?: any;
};

type RuleFunction<T> = (params: RuleFunctionParams) => T;

const ruleFunctions: { [key: string]: RuleFunction<boolean> } = {
  hasValue: ({ location }) => !isEmpty(location),
  doesNotHaveValue: ({ location }) => isEmpty(location),
  equalTo: ({ location, comparingValue }) =>
    location === safeJsonParse(comparingValue),
  notEqualTo: ({ location, comparingValue }) =>
    location !== safeJsonParse(comparingValue),
  contains: ({ location, comparingValue }) =>
    location?.includes(comparingValue),
  notContains: ({ location, comparingValue }) =>
    !location?.includes(comparingValue),
  equalToMultiple: ({ location, comparingValue }) => {
    if (Array.isArray(location)) {
      return location?.some((locItem: any) =>
        comparingValue?.some((item: any) => safeJsonParse(item) === locItem),
      );
    }
    return comparingValue?.some(
      (item: any) => safeJsonParse(item) === location,
    );
  },
  notEqualToMultiple: ({ location, comparingValue }) => {
    if (Array.isArray(location)) {
      return location?.every((locItem: any) =>
        comparingValue?.every((item: any) => safeJsonParse(item) !== locItem),
      );
    }
    return comparingValue?.every(
      (item: any) => safeJsonParse(item) !== location,
    );
  },
  greaterThan: ({ location, comparingValue }) => {
    return location > comparingValue;
  },
  lessThan: ({ location, comparingValue }) => {
    return location > comparingValue;
  },
  greaterThanOrEqualTo: ({ location, comparingValue }) => {
    return location >= comparingValue;
  },
  lessThanOrEqualTo: ({ location, comparingValue }) => {
    return location <= comparingValue;
  },
};

export const ruleFormulaFunctions: { [key: string]: RuleFunction<string> } = {
  addTextBefore: ({ location, comparingValue }) => {
    return `${comparingValue}${location}`;
  },
  addTextAfter: ({ location, comparingValue }) => {
    return `${location}${comparingValue}`;
  },
};

type UseHandlerProps = {
  valueHandlers: any;
};

export const useRuleHandler = () => {
  return ({ valueHandlers }: UseHandlerProps) => {
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
        const transformedLocation = valueHandlers["boundCode"]({
          boundCode: location,
          dataType: "boundCode",
        });

        // Evaluate the rule
        const ruleFunction = ruleFunctions[rule] ?? ruleFormulaFunctions[rule];
        const ruleResult = ruleFunction({
          location: transformedLocation,
          comparingValue: transformedValue,
        });

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
        return valueHandlers.boundCode(rules?.value);
      }

      for (const rule of rules.rules) {
        const ruleResult = evaluateCondition(rule);
        if (ruleResult) {
          if (ruleFormulaFunctions[rule.conditions[0].rule]) {
            return ruleResult;
          }
          return valueHandlers[rule.result?.dataType ?? "static"](rule.result);
        }
      }
      if (["YesNo", "Boolean"].includes(rules.fieldType)) {
        return false;
      }
      return;
    }

    return evaluateRules;
  };
};
