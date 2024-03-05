import { Icon } from "@/components/Icon";
import { TopLabel } from "@/components/TopLabel";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { Button, Flex, Group, Stack, TextInput } from "@mantine/core";
import { useEffect } from "react";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { useForm } from "@mantine/form";

export const SelectOptionsForm = ({ component }: { component: Component }) => {
  const form = useForm({
    initialValues: {
      props: {
        data: component.props?.data ?? [],
        style: {
          display: component.props?.style?.display,
        },
      },
    },
  });

  useEffect(() => {
    if (form.isTouched() && form.isDirty()) {
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
      <VisibilityModifier
        componentId={component.id!}
        componentName={component.name}
        form={form}
      />
    </Stack>
  );
};
