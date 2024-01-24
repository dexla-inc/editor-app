import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Component, debouncedTreeUpdate } from "@/utils/editor";
import { useForm } from "@mantine/form";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useEffect } from "react";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { pick } from "next/dist/lib/pick";
import { ActionIcon, Box, Group } from "@mantine/core";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import { useEditorStore } from "@/stores/editor";

type StaticFormFieldsBuilderProps = {
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    additionalComponent?: JSX.Element;
  }>;
  component: Component;
};

export const StaticFormFieldsBuilder = ({
  component,
  fields,
}: StaticFormFieldsBuilderProps) => {
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const { dataType = "static" } = component.props!;

  const form = useForm({
    initialValues: {
      ...pick(
        component.props ?? {},
        fields.map((f) => f.name),
      ),
      actionCode: component.props?.actionCode ?? {},
      variable: component.props?.variable ?? "",
    },
  });
  const { getSelectedVariable } = useBindingPopover();

  const onClickToggleDataType = () => {
    updateTreeComponentAttrs([component.id!], {
      props: {
        dataType: dataType === "static" ? "dynamic" : "static",
      },
    });
  };

  const DataTypeIcon = dataType === "static" ? IconPlug : IconPlugOff;

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeUpdate([component.id!], form.values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const hasParentComponentData = component.parentDataComponentId;

  return (
    <>
      {fields.map((f) => (
        <Box key={f.name}>
          <Group
            noWrap
            align="flex-end"
            spacing={10}
            grow={!hasParentComponentData}
          >
            <ComponentToBindFromInput
              category="data"
              key={f.name}
              componentId={component?.id!}
              onPickVariable={(variable: string) =>
                form.setFieldValue("variable", variable)
              }
              actionData={[]}
              javascriptCode={form.values.actionCode}
              onChangeJavascriptCode={(javascriptCode: string, label: string) =>
                form.setFieldValue(`actionCode`, {
                  ...form.values.actionCode,
                  [label]: javascriptCode,
                })
              }
              size="xs"
              label={f.label}
              type={f.type}
              placeholder={f.placeholder}
              {...form.getInputProps(f.name)}
              onChange={(e) => {
                const selectedVariable = getSelectedVariable(
                  e.currentTarget.value,
                );
                form.setValues({
                  [f.name]: selectedVariable
                    ? selectedVariable.defaultValue
                    : e.currentTarget.value,
                });
              }}
            />
            {hasParentComponentData && (
              <ActionIcon onClick={onClickToggleDataType} variant="default">
                <DataTypeIcon />
              </ActionIcon>
            )}
          </Group>
          {f.additionalComponent}
        </Box>
      ))}
      <VisibilityModifier
        componentId={component.id!}
        componentName={component.name}
        form={form}
      />
    </>
  );
};
