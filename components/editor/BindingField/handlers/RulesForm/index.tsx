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
import { BG_RULES_CONDITION } from "@/utils/branding";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  ConditionProps,
  DataType,
  RuleItemProps,
  RuleProps,
} from "@/types/dataBinding";
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
import { CurrentValueField } from "@/components/editor/BindingField/components/CurrentValueField";

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
      rules: form.values,
      dataType: "rules",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack spacing={10}>
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
          onClick={() =>
            form.insertListItem("rules", {
              conditions: [{ rule: "equalTo", value: {}, result: {} }],
            })
          }
        >
          Add Rule
        </Button>
      </Flex>

      {form.values.rules?.map((rule, ruleIndex) => {
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
                <Text size={14} weight="bold">
                  Rule {`${ruleIndex + 1}`}
                </Text>
                <Text size="xs">{transformRuleProps(rule)}</Text>
              </AccordionControl>
              <Accordion.Panel>
                <Stack spacing={0}>
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

function transformRuleProps(ruleProps: RuleItemProps) {
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

  const result =
    ruleProps.result?.dataType === DataType.boundCode
      ? extractContextAndAttributes(ruleProps.result?.boundCode)
      : ruleProps.result?.static;

  return `${conditionString}${result}`;
}
