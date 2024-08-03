import { useBindingField } from "@/components/editor/BindingField/components/ComponentToBindFromInput";
import { CurrentValueField } from "@/components/editor/BindingField/components/CurrentValueField";
import {
  extractContextAndAttributes,
  LocationField,
} from "@/components/editor/BindingField/handlers/RulesForm/LocationField";
import { ResultField } from "@/components/editor/BindingField/handlers/RulesForm/ResultField";
import { RuleTitle } from "@/components/editor/BindingField/handlers/RulesForm/RuleTitle";
import {
  logicalRulesData,
  SelectComparisonRuleField,
} from "@/components/editor/BindingField/handlers/RulesForm/SelectComparisonRuleField";
import { ValueField } from "@/components/editor/BindingField/handlers/RulesForm/ValueField";
import { ruleFormulaFunctions } from "@/hooks/data/useRuleHandler";
import { ConditionProps, DataType, RuleProps } from "@/types/dataBinding";
import { BG_RULES_CONDITION } from "@/utils/branding";
import { isEmpty } from "@/utils/common";
import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Box,
  Button,
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import get from "lodash.get";
import { useEffect } from "react";

export const RulesForm = () => {
  const {
    fieldType,
    value,
    onChange,
    inputOnChange,
    name,
    label,
    defaultValue,
    ...restBindingFieldProps
  } = useBindingField();

  const rules = (
    isEmpty(value.rules)
      ? {
          value: {},
          rules: [],
        }
      : value.rules
  ) as RuleProps;

  const form = useForm({
    initialValues: rules,
  });

  useEffect(() => {
    onChange({
      ...value,
      rules: { ...form.values, fieldType },
      dataType: "rules",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack spacing={15}>
      <Flex justify="space-between" align="center">
        <Text size="sm" weight="bold">
          {!form.values.rules?.length &&
            extractContextAndAttributes(form.values.value?.boundCode)}
        </Text>
        <Button
          styles={{ root: { justifySelf: "self-end" } }}
          fw={400}
          leftIcon={<IconPlus size={15} />}
          variant="default"
          onClick={() => {
            let condition: Partial<ConditionProps> = {
              rule: "equalTo",
              value: {},
            };
            if (!form.values.rules?.length) {
              condition.location = form.values.value?.boundCode;
            }

            form.insertListItem("rules", {
              conditions: [condition],
              result: { dataType: "static", static: defaultValue },
            });
          }}
        >
          Add Rule
        </Button>
      </Flex>

      {form.values.rules?.map((rule, ruleIndex) => {
        const isRuleFormula =
          ruleFormulaFunctions[get(rule, "conditions[0].rule", "")] !==
          undefined;

        return (
          <Accordion
            key={ruleIndex}
            transitionDuration={300}
            defaultValue={["item-0"]}
            multiple
            bg={BG_RULES_CONDITION}
            styles={{
              content: { paddingTop: 0 },
              label: { padding: "0.75rem 0" },
            }}
          >
            <Accordion.Item value={`item-${ruleIndex}`}>
              <AccordionControl
                onClickDeleteRule={() =>
                  form.removeListItem("rules", ruleIndex)
                }
              >
                <RuleTitle
                  ruleProps={rule}
                  fallback={`Rule ${ruleIndex + 1}`}
                />
              </AccordionControl>
              <Accordion.Panel>
                <Stack spacing={0}>
                  {rule.conditions?.map((condition, conditionIndex) => {
                    const MULTIPLE_RULES = [
                      "equalToMultiple",
                      "notEqualToMultiple",
                    ];
                    const isRuleMultiple = MULTIPLE_RULES.includes(
                      condition.rule,
                    );
                    const isRuleValueCheck = [
                      "hasValue",
                      "doesNotHaveValue",
                    ].includes(condition.rule);

                    const { valuePlaceholder } =
                      logicalRulesData.find(
                        (item) => item.value === condition.rule,
                      ) ?? {};

                    const onSelectLogicalRule = (selectedRule: string) => {
                      if (condition.value.dataType !== "boundCode") {
                        if (MULTIPLE_RULES.includes(selectedRule!)) {
                          if (!Array.isArray(condition.value.static)) {
                            form.setFieldValue(
                              `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                              { ...condition.value, static: [] },
                            );
                          }
                        } else {
                          if (typeof condition.value.static !== "string") {
                            form.setFieldValue(
                              `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                              { ...condition.value, static: "" },
                            );
                          }
                        }
                      }

                      form.setFieldValue(
                        `rules.${ruleIndex}.conditions.${conditionIndex}.rule`,
                        selectedRule,
                      );
                    };

                    const onClickDeleteRuleCondition = () => {
                      form.removeListItem(
                        `rules.${ruleIndex}.conditions`,
                        conditionIndex,
                      );
                    };

                    return (
                      <Stack key={conditionIndex} p={0} spacing={0}>
                        <Flex w="100%" justify="space-between" align="center">
                          {rule.conditions.length > 1 && (
                            <ActionIcon onClick={onClickDeleteRuleCondition}>
                              <IconTrash size="1rem" color="red" />
                            </ActionIcon>
                          )}
                        </Flex>

                        <LocationField
                          {...form.getInputProps(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.location`,
                          )}
                        />
                        {condition.location && (
                          <>
                            <SelectComparisonRuleField
                              withAsterisk
                              {...form.getInputProps(
                                `rules.${ruleIndex}.conditions.${conditionIndex}.rule`,
                              )}
                              onChange={onSelectLogicalRule}
                            />
                            <ValueField
                              id={extractContextAndAttributes(
                                condition.location,
                                true,
                              )}
                              placeholder={valuePlaceholder!}
                              isSingle={!isRuleMultiple && !isRuleValueCheck}
                              isMultiple={isRuleMultiple}
                              {...form.getInputProps(
                                `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                              )}
                            />
                          </>
                        )}
                      </Stack>
                    );
                  })}

                  {rule.conditions?.[0].location && !isRuleFormula && (
                    <ResultField
                      {...restBindingFieldProps}
                      fieldType={fieldType}
                      {...form.getInputProps(`rules.${ruleIndex}.result`)}
                    />
                  )}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        );
      })}

      <CurrentValueField
        value={value}
        onChange={(selectedItem: string) => {
          form.setValues({
            value: {
              boundCode: `return ${selectedItem}`,
              dataType: DataType.boundCode,
            },
          });
        }}
        hideBindingContextSelector={!form.values.rules?.length}
      />
    </Stack>
  );
};

function AccordionControl(
  props: AccordionControlProps & {
    onClickDeleteRule: () => void;
  },
) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Accordion.Control
        {...props}
        sx={{ "&:hover": { background: "transparent" }, paddingLeft: 14 }}
      />
      <ActionIcon onClick={props.onClickDeleteRule} size="md" mr={15}>
        <IconTrash size="1rem" color="red" />
      </ActionIcon>
    </Box>
  );
}
