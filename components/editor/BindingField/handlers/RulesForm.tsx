import { BindingContextSelector } from "@/components/editor/BindingField/components/BindingContextSelector";
import {
  logicalRulesData,
  SelectLogicalRules,
} from "@/components/editor/BindingField/components/SelectLogicalRules";
import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  MultiSelect,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { BG_RULES_GROUP, BG_RULE, BG_LOCATION } from "@/utils/branding";
import { IconTrash } from "@tabler/icons-react";
import { RuleProps } from "@/types/dataBinding";
import isEmpty from "lodash.isempty";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useBindingField } from "@/components/ComponentToBindFromInput";
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
  const Field = ComponentToBindField[fieldType];
  return (
    <Stack style={{ background: BG_RULES_GROUP }} px={20} py={30}>
      {form.values.rules.map((rule, ruleIndex) => {
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
                onClickDelete={() => form.removeListItem("rules", ruleIndex)}
              >
                <Text size={15} weight="bold">
                  Rule {`${ruleIndex + 1}`}
                </Text>
              </AccordionControl>
              <Accordion.Panel>
                <Flex direction="column" gap={10}>
                  {rule.conditions.map((condition, conditionIndex) => {
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

                    return (
                      <>
                        {isEmpty(condition.location) && (
                          <BindingContextSelector
                            setSelectedItem={onSetSelectedLocation}
                          />
                        )}
                        {isEmpty(condition.location) || (
                          <Group>
                            <Text size="xs" weight="bold">
                              {extractContextAndAttributes(condition.location)}
                            </Text>
                            <Button variant="default" onClick={onResetLocation}>
                              Edit
                            </Button>
                          </Group>
                        )}
                        <SelectLogicalRules
                          {...form.getInputProps(
                            `rules.${ruleIndex}.conditions.${conditionIndex}.rule`,
                          )}
                          onChange={onSelectLogicalRule}
                        />
                        {!isRuleMultiple && !isRuleValueCheck && (
                          <TextInput
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
                            data={condition.value as string[]}
                            searchable
                            creatable
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
                        <Stack>
                          <TopLabel text="Addional Logic?" />
                          <SegmentedControl
                            w="50%"
                            defaultValue="-"
                            data={[
                              ...[
                                { label: "AND", value: "and" },
                                { label: "OR", value: "or" },
                              ],
                              ...(!condition.operator
                                ? [{ label: "-", value: "-" }]
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
                              if (form.values.rules.length - 1 === ruleIndex) {
                                form.insertListItem(
                                  `rules.${ruleIndex}.conditions`,
                                  {},
                                );
                              }
                            }}
                          />
                          <Divider />
                        </Stack>
                      </>
                    );
                  })}

                  <Field
                    withAsterisk
                    label="Result"
                    {...form.getInputProps(`rules.${ruleIndex}.result`)}
                  />

                  <Button
                    onClick={() =>
                      form.insertListItem("rules", { conditions: [{}] })
                    }
                  >
                    Add rule
                  </Button>
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        );
      })}
    </Stack>
  );
};

function AccordionControl(
  props: AccordionControlProps & { onClickDelete: () => void },
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Accordion.Control {...props} />
      <ActionIcon onClick={props.onClickDelete} size="md">
        <IconTrash size="1rem" color="red" />
      </ActionIcon>
    </Box>
  );
}

function extractContextAndAttributes(input: string) {
  const regex = /(\w+)\[\/\* (.*?) \*\/ '.*?'\](.*)|(\w+)\['(.*?)'\](.*)/;
  const match = input.match(regex);

  if (match) {
    if (match[1]) {
      // Case with comments
      const keyword = match[1]; // The keyword (e.g., variables, auth, or any other word)
      const comment = match[2]; // The comment inside the /* ... */ block
      const attributes = match[3]; // The remaining part of the string after the key

      const formattedAttributes = attributes.replace(/\['.*?'\]/, ""); // Remove any additional keys in square brackets

      return `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - ${comment.charAt(0).toUpperCase() + comment.slice(1)}${formattedAttributes}`;
    } else if (match[4]) {
      // Case without comments
      const keyword = match[4]; // The keyword (e.g., variables, auth, or any other word)
      const comment = match[5]; // The key inside the brackets
      const attributes = match[6]; // The remaining part of the string after the key

      const formattedAttributes = attributes.replace(/\['.*?'\]/, ""); // Remove any additional keys in square brackets

      return `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - ${comment.charAt(0).toUpperCase() + comment.slice(1)}${formattedAttributes}`;
    }
  } else {
    return "Invalid input format";
  }
}
