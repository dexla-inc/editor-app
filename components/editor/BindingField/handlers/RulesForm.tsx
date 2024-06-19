import { BindingContextSelector } from "@/components/editor/BindingField/components/BindingContextSelector";
import {
  logicalRulesData,
  SelectLogicalRules,
} from "@/components/editor/BindingField/components/SelectLogicalRules";
import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Anchor,
  Box,
  Button,
  Flex,
  Group,
  MultiSelect,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { BG_RULES_GROUP, BG_RULE, BG_RULES_CONDITION } from "@/utils/branding";
import { IconTrash } from "@tabler/icons-react";
import { RuleProps } from "@/types/dataBinding";
import isEmpty from "lodash.isempty";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useBindingField } from "@/components/editor/BindingField/components/ComponentToBindFromInput";
import { TopLabel } from "@/components/TopLabel";
import { cloneObject } from "@/utils/common";

export const RulesForm = () => {
  const { fieldType, value, onChange } = useBindingField();
  const rules = (
    isEmpty(value.rules) ? [{ conditions: [{}] }] : value.rules
  ) as RuleProps[];

  const form = useForm({
    initialValues: {
      rules,
    },
  });

  useEffect(() => {
    onChange({
      ...value,
      rules: cloneObject(form.values.rules),
      dataType: "rules",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  // @ts-ignore
  const Field = ComponentToBindField[fieldType] || ComponentToBindField.Text;
  return (
    <Stack style={{ background: BG_RULES_GROUP }} px={20} py={30}>
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

                    const onSetSelectedLocation = (selectedItem: string) =>
                      form.setFieldValue(
                        `rules.${ruleIndex}.conditions.${conditionIndex}.location`,
                        selectedItem,
                      );

                    const onResetLocation = () =>
                      form.setFieldValue(
                        `rules.${ruleIndex}.conditions.${conditionIndex}.location`,
                        undefined,
                      );

                    const onSelectLogicalRule = (selectedRule: string) => {
                      if (
                        ["equalToMultiple", "notEqualToMultiple"].includes(
                          selectedRule!,
                        )
                      ) {
                        if (!Array.isArray(condition.value)) {
                          form.setFieldValue(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                            [],
                          );
                        }
                      } else {
                        if (typeof condition.value !== "string") {
                          form.setFieldValue(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                            "",
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

                        <Stack spacing={1}>
                          <TopLabel text="Location" mt={3} required />
                          {isEmpty(condition.location) && (
                            <BindingContextSelector
                              setSelectedItem={onSetSelectedLocation}
                            />
                          )}
                          {isEmpty(condition.location) || (
                            <Group>
                              <Text size="xs" weight="bold">
                                {extractContextAndAttributes(
                                  condition.location,
                                )}
                              </Text>
                              <Anchor
                                variant="default"
                                onClick={onResetLocation}
                                size="xs"
                              >
                                Edit
                              </Anchor>
                            </Group>
                          )}
                        </Stack>
                        <SelectLogicalRules
                          withAsterisk
                          {...form.getInputProps(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.rule`,
                          )}
                          onChange={onSelectLogicalRule}
                          defaultValue="equalto"
                        />
                        {!isRuleMultiple && !isRuleValueCheck && (
                          <TextInput
                            withAsterisk
                            label="Value"
                            placeholder={valuePlaceholder}
                            {...form.getInputProps(
                              `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                            )}
                          />
                        )}
                        {isRuleMultiple && (
                          <MultiSelect
                            label="Value"
                            placeholder={valuePlaceholder}
                            data={(condition.value as string[]) ?? []}
                            searchable
                            creatable
                            withAsterisk
                            getCreateLabel={(query) => `+ Create ${query}`}
                            {...form.getInputProps(
                              `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                            )}
                            onCreate={(query) => {
                              const item = { value: query, label: query };
                              form.setFieldValue(
                                `rules.${ruleIndex}.conditions.${conditionIndex}.value`,
                                [...condition.value, item],
                              );
                              return item;
                            }}
                          />
                        )}
                        <Stack spacing={2}>
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
                                  {},
                                );
                              }
                            }}
                          />
                        </Stack>
                      </Stack>
                    );
                  })}

                  <Field
                    withAsterisk
                    label="Result"
                    {...form.getInputProps(`rules.${ruleIndex}.result`)}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        );
      })}
      <Button
        onClick={() => form.insertListItem("rules", { conditions: [{}] })}
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

function extractContextAndAttributes(input: string) {
  const regexWithComment = /(\w+)\[\/\* (.*?) \*\/ ?'.*?'\](.*)/;
  const regexWithoutComment = /(\w+)\['(.*?)'\](.*)/;
  let match = input.match(regexWithComment);

  if (!match) {
    match = input.match(regexWithoutComment);
  }

  if (match) {
    const keyword = match[1];
    const comment = match[2];
    const attributes = match[3];

    const formattedAttributes = attributes.replace(/\['.*?'\]/, "").trim();

    return `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - ${comment.charAt(0).toUpperCase() + comment.slice(1)}${formattedAttributes}`;
  }

  return "";
}
