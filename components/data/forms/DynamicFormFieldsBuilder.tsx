import { ActionIcon, Group, Select, Stack, Text, Title } from "@mantine/core";
import { IconPlug, IconPlugOff, IconRefresh } from "@tabler/icons-react";
import { Component } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";

type DynamicFormFieldsBuilderProps = {
  title?: string;
  subTitle?: string;
  form: any;
  component: Component;
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
  }>;
  selectableObjectKeys: string[];
};

export const DynamicFormFieldsBuilder = ({
  title,
  subTitle,
  component,
  form,
  selectableObjectKeys,
  fields,
}: DynamicFormFieldsBuilderProps) => {
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const { dataType = "static" } = component.props!;

  const onClickToggleDataType = () => {
    updateTreeComponentAttrs([component.id!], {
      props: {
        dataType: component.props?.dataType === "static" ? "dynamic" : "static",
      },
    });
  };

  const DataTypeIcon = dataType === "static" ? IconPlug : IconPlugOff;

  const hasParentComponentData = component.parentDataComponentId;

  return (
    <Stack spacing="xs" my="xs">
      {title && (
        <Title order={6} mt="xs">
          {title}
        </Title>
      )}
      {subTitle && (
        <Text size="xs" color="dimmed">
          {subTitle}
        </Text>
      )}

      {fields.map((f) => (
        <Group
          key={f.name}
          noWrap
          align="flex-end"
          spacing={10}
          grow={!hasParentComponentData}
        >
          <Select
            key={f.name}
            label={f.label}
            data={selectableObjectKeys}
            {...form.getInputProps(f.name)}
          />
          {hasParentComponentData && (
            <ActionIcon onClick={onClickToggleDataType} variant="default">
              <DataTypeIcon />
            </ActionIcon>
          )}
        </Group>
      ))}
    </Stack>
  );
};
