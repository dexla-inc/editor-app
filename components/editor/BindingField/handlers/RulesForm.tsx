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
  const rules = (isEmpty(value.rules) ? [{}] : value.rules) as RuleProps[];

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
      {form.values.rules.map((rule, index) => {
        const isRuleMultiple = [
          "equalToMultiple",
          "notEqualToMultiple",
        ].includes(rule.rule);

        const { valuePlaceholder } =
          logicalRulesData.find((item) => item.value === rule.rule) ?? {};

        const onSetSelectedLocation = (selectedItem: string) =>
          form.setFieldValue(`rules.${index}.location`, selectedItem);

        const onResetLocation = () =>
          form.setFieldValue(`rules.${index}.location`, null);

        const onSelectLogicalRule = (selectedRule: string) => {
          if (
            ["equalToMultiple", "notEqualToMultiple"].includes(selectedRule!)
          ) {
            if (!Array.isArray(rule.value)) {
              form.setFieldValue(`rules.${index}.value`, []);
            }
          } else {
            if (typeof rule.value !== "string") {
              form.setFieldValue(`rules.${index}.value`, "");
            }
          }
          form.setFieldValue(`rules.${index}.rule`, selectedRule);
        };

        return (
          <Accordion
            key={index}
            transitionDuration={300}
            defaultValue={["item-0"]}
            multiple
            bg={BG_RULE}
          >
            <Accordion.Item value={`item-${index}`}>
              <AccordionControl
                onClickDelete={() => form.removeListItem("rules", index)}
              >
                <Text size={15} weight="bold">
                  Rule {`${index + 1}`}
                </Text>
              </AccordionControl>
              <Accordion.Panel>
                <Flex direction="column" gap={10}>
                  {isEmpty(rule.location) && (
                    <BindingContextSelector
                      setSelectedItem={onSetSelectedLocation}
                    />
                  )}
                  {isEmpty(rule.location) || (
                    <Group>
                      <Text size="xs" weight="bold">
                        {extractContextAndAttributes(rule.location)}
                      </Text>
                      <Button variant="default" onClick={onResetLocation}>
                        Edit
                      </Button>
                    </Group>
                  )}
                  <SelectLogicalRules
                    {...form.getInputProps(`rules.${index}.rule`)}
                    onChange={onSelectLogicalRule}
                  />
                  {isRuleMultiple || (
                    <TextInput
                      label="Value"
                      placeholder={valuePlaceholder}
                      {...form.getInputProps(`rules.${index}.value`)}
                    />
                  )}
                  {isRuleMultiple && (
                    <MultiSelect
                      label="Value"
                      placeholder={valuePlaceholder}
                      data={rule.value as string[]}
                      searchable
                      creatable
                      getCreateLabel={(query) => `+ Create ${query}`}
                      {...form.getInputProps(`rules.${index}.value`)}
                      onCreate={(query) => {
                        const item = { value: query, label: query };
                        form.setFieldValue(`rules.${index}.value`, [
                          ...rule.value,
                          item,
                        ]);
                        return item;
                      }}
                    />
                  )}
                  <Field
                    withAsterisk
                    label="Result"
                    {...form.getInputProps(`rules.${index}.result`)}
                  />
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
                        ...(!rule.operator ? [{ label: "-", value: "-" }] : []),
                      ]}
                      {...form.getInputProps(`rules.${index}.operator`)}
                      onChange={(op) => {
                        form.setFieldValue(`rules.${index}.operator`, op);
                        if (form.values.rules.length - 1 === index) {
                          form.insertListItem("rules", [{}]);
                        }
                      }}
                    />
                  </Stack>
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
