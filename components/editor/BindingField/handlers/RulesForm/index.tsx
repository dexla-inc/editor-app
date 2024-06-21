import {
  logicalRulesData,
  SelectComparisonRuleField,
} from "@/components/editor/BindingField/handlers/RulesForm/SelectComparisonRuleField";
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
import { BG_RULES_GROUP, BG_RULE, BG_RULES_CONDITION } from "@/utils/branding";
import { IconTrash } from "@tabler/icons-react";
import { ConditionProps, RuleProps } from "@/types/dataBinding";
import isEmpty from "lodash.isempty";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useBindingField } from "@/components/editor/BindingField/components/ComponentToBindFromInput";
import {
  extractContextAndAttributes,
  LocationField,
} from "@/components/editor/BindingField/handlers/RulesForm/LocationField";
import { ValueField } from "@/components/editor/BindingField/handlers/RulesForm/ValueField";
import get from "lodash.get";
import { ResultField } from "@/components/editor/BindingField/handlers/RulesForm/ResultField";

export const RulesForm = () => {
  const {
    fieldType,
    value,
    onChange,
    inputOnChange,
    name,
    label,
    ...restBindingFieldProps
  } = useBindingField();

  const rules = (
    isEmpty(value.rules)
      ? [
          {
            conditions: [
              {
                rule: "equalTo",
                value: {},
              },
            ],
          },
        ]
      : value.rules
  ) as RuleProps[];

  const form = useForm({
    initialValues: {
      rules,
    },
  });
  console.log(form.values);
  useEffect(() => {
    onChange({
      ...value,
      rules: form.values.rules,
      dataType: "rules",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack style={{ background: BG_RULES_GROUP }} px={20} py={30} w="100%">
      {form.values.rules?.map((rule, ruleIndex) => {
        return (
          <Accordion
            key={ruleIndex}
            transitionDuration={300}
            defaultValue={["item-0"]}
            multiple
            bg={BG_RULE}
          >
            <Accordion.Item value={`item-${ruleIndex}`}>
              <AccordionControl
                displayDeleteButton={form.values.rules.length > 1}
                onClickDeleteRule={() =>
                  form.removeListItem("rules", ruleIndex)
                }
              >
                <Text size={15} weight="bold">
                  Rule {`${ruleIndex + 1}`}
                </Text>
                <Text size="xs">{transformRuleProps(rule)}</Text>
              </AccordionControl>
              <Accordion.Panel>
                <Stack spacing={10}>
                  {rule.conditions?.map((condition, conditionIndex) => {
                    const isRuleMultiple = [
                      "equalToMultiple",
                      "notEqualToMultiple",
                    ].includes(condition.rule);
                    const isRuleValueCheck = [
                      "hasValue",
                      "doesNotHaveValue",
                    ].includes(condition.rule);

                    const { valuePlaceholder } =
                      logicalRulesData.find(
                        (item) => item.value === condition.rule,
                      ) ?? {};

                    const onSelectLogicalRule = (selectedRule: string) => {
                      if (
                        ["equalToMultiple", "notEqualToMultiple"].includes(
                          selectedRule!,
                        )
                      ) {
                        if (!Array.isArray(condition.value)) {
                          form.setFieldValue(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                            { ...condition.value, static: [] },
                          );
                        }
                      } else {
                        if (typeof condition.value !== "string") {
                          form.setFieldValue(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                            { ...condition.value, static: "" },
                          );
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
                      <Stack
                        key={conditionIndex}
                        bg={BG_RULES_CONDITION}
                        p={10}
                        spacing={0}
                      >
                        <Flex w="100%" justify="space-between" align="center">
                          <Text size="xs" weight="bold">
                            Condition {conditionIndex + 1}
                          </Text>
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
                        <SelectComparisonRuleField
                          withAsterisk
                          {...form.getInputProps(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.rule`,
                          )}
                          onChange={onSelectLogicalRule}
                        />
                        <ValueField
                          placeholder={valuePlaceholder!}
                          isSingle={!isRuleMultiple && !isRuleValueCheck}
                          isMultiple={isRuleMultiple}
                          {...form.getInputProps(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                          )}
                        />
                        {/* Temporarily commenting out as chaining is confusing at the moment.
                        Will revisit after ticket 86dtvrcwk is completed */}
                        {/* <Stack spacing={2}>
                          <TopLabel text="Chain Condition" mt={3} />
                          <SegmentedControl
                            size="xs"
                            w="30%"
                            defaultValue="none"
                            data={[
                              ...[
                                { label: "AND", value: "and" },
                                { label: "OR", value: "or" },
                              ],
                              ...(!condition.operator
                                ? [{ label: "None", value: "none" }]
                                : []),
                            ]}
                            {...form.getInputProps(
                              `rules.${ruleIndex}.conditions.${conditionIndex}.operator`,
                            )}
                            onChange={(op) => {
                              form.setFieldValue(
                                `rules.${ruleIndex}.conditions.${conditionIndex}.operator`,
                                op,
                              );

                              if (!condition.operator) {
                                form.insertListItem(
                                  `rules.${ruleIndex}.conditions`,
                                  { rule: "equalTo" },
                                );
                              }
                            }}
                          />
                        </Stack> */}
                      </Stack>
                    );
                  })}

                  <ResultField
                    {...restBindingFieldProps}
                    fieldType={fieldType}
                    {...form.getInputProps(`rules.${ruleIndex}.result`)}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        );
      })}
      <Button
        onClick={() =>
          form.insertListItem("rules", {
            conditions: [{ rule: "equalTo", value: {} }],
          })
        }
      >
        Add rule
      </Button>
    </Stack>
  );
};

function AccordionControl(
  props: AccordionControlProps & {
    onClickDeleteRule: () => void;
    displayDeleteButton: boolean;
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
        sx={{ "&:hover": { background: "transparent" } }}
      />
      {props.displayDeleteButton && (
        <ActionIcon onClick={props.onClickDeleteRule} size="md" mr={15}>
          <IconTrash size="1rem" color="red" />
        </ActionIcon>
      )}
    </Box>
  );
}

function transformRuleProps(ruleProps: RuleProps) {
  const condition: ConditionProps = get(
    ruleProps,
    "conditions[0]",
    {} as ConditionProps,
  );

  if (condition.location === undefined || condition.rule === undefined) {
    return;
  }

  const value =
    condition.value?.dataType === "boundCode"
      ? extractContextAndAttributes(condition.value.boundCode ?? "")
      : condition.value?.static;

  let conditionString = `${extractContextAndAttributes(condition.location)} > ${condition.rule} > `;
  if (value !== undefined) conditionString += `${value} > `;

  return `${conditionString}${ruleProps.result}`;
}
