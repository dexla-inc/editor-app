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
  Flex,
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
                  <BindingContextSelector setSelectedItem={console.log} />
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
                      placeholder={valuePlaceholder}
                      {...form.getInputProps(`rules.${index}.value`)}
                    />
                  )}
                  {isRuleMultiple && (
                    <MultiSelect
                      label="Value"
                      placeholder={valuePlaceholder}
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
