import { Icon } from "@/components/Icon";
import { TopLabel } from "@/components/TopLabel";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Button, Flex, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/types/dataBinding";

export const SelectOptionsForm = ({
  component,
  endpoints,
}: Omit<DataProps, "dataType">) => {
  const form = useForm({
    initialValues: {
      props: {
        data: component.props?.data ?? [],
      },
      onLoad: { value: component.onLoad?.value ?? "" },
    },
  });

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({ attrs: form.values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack>
      <Flex justify="space-between" gap="xl" mt="0.5rem">
        <TopLabel text="Options" />
        <Button
          type="button"
          compact
          onClick={() => {
            form.insertListItem("props.data", { label: "", value: "" });
          }}
          variant="default"
          sx={{ marginRight: 0 }}
          leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
        >
          Add
        </Button>
      </Flex>

      <Flex direction="column" gap="10px">
        {/* @ts-ignore*/}
        {form.values.props.data.map((_, index) => {
          return (
            <Group key={index} style={{ flexWrap: "nowrap" }}>
              <TextInput
                size="xs"
                placeholder="label"
                {...form.getInputProps(`props.data.${index}.label`)}
                style={{ width: "50%" }}
              />
              <TextInput
                size="xs"
                placeholder="value"
                {...form.getInputProps(`props.data.${index}.value`)}
                style={{ width: "50%" }}
              />

              <Icon
                name={ICON_DELETE}
                onClick={() => {
                  form.removeListItem("props.data", index);
                }}
                style={{ cursor: "pointer" }}
              />
            </Group>
          );
        })}
      </Flex>
      <FormFieldsBuilder
        fields={[{ name: "value", label: "Value", type: "text" }]}
        component={component}
        endpoints={endpoints!}
      />
    </Stack>
  );
};
