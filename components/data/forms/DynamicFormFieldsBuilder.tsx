import { Select, Stack, Text, Title } from "@mantine/core";

type DynamicFormFieldsBuilderProps = {
  title?: string;
  subTitle?: string;
  form: any;
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
  form,
  selectableObjectKeys,
  fields,
}: DynamicFormFieldsBuilderProps) => {
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
        <Select
          key={f.name}
          label={f.label}
          data={selectableObjectKeys}
          {...form.getInputProps(f.name)}
        />
      ))}
    </Stack>
  );
};
