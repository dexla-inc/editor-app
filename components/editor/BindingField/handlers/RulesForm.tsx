import { BindingContextSelector } from "@/components/editor/BindingField/components/BindingContextSelector";
import { SelectLogicalRules } from "@/components/editor/BindingField/components/SelectLogicalRules";
import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Box,
  Flex,
  MultiSelect,
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

export const RulesForm = () => {
  const { fieldType, value, onChange } = useBindingField();
  const rules = (isEmpty(value.rules) ? [{}] : value.rules) as RuleProps[];

  const form = useForm({
    initialValues: {
      rules,
    },
  });
  console.log(form.values);
  useEffect(() => {
    if (form.isTouched()) {
      onChange({ ...value, rules: form.values.rules, dataType: "rules" });
    }
  }, [form.values]);

  // @ts-ignore
  const Field = ComponentToBindField[fieldType];
  return (
    <Stack style={{ background: BG_RULES_GROUP }}>
      {form.values.rules.map((rule, index) => {
        const isRuleMultiple = [
          "equalToMultiple",
          "notEqualToMultiple",
        ].includes(rule.rule);

        return (
          <Accordion
            key={index}
            transitionDuration={300}
            defaultValue={["item-0"]}
            multiple
            mx={20}
            my={30}
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
                  <BindingContextSelector />
                  <SelectLogicalRules
                    {...form.getInputProps(`rules.${index}.rule`)}
                    onChange={(selectedRule) => {
                      if (
                        ["equalToMultiple", "notEqualToMultiple"].includes(
                          selectedRule!,
                        )
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
                    }}
                  />
                  {isRuleMultiple || (
                    <TextInput
                      label="Value"
                      {...form.getInputProps(`rules.${index}.value`)}
                    />
                  )}
                  {isRuleMultiple && (
                    <MultiSelect
                      label="Value"
                      value={rule.value as string[]}
                      data={rule.value as string[]}
                      searchable
                      creatable
                      getCreateLabel={(query) => `+ Create ${query}`}
                      onChange={(val) => {
                        form.setFieldValue(`rules.${index}.value`, val);
                      }}
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
                    label="Result"
                    {...form.getInputProps(`rules.${index}.result`)}
                  />
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
