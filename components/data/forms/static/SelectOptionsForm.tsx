import { Icon } from "@/components/Icon";
import { TopLabel } from "@/components/TopLabel";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { Button, Flex, Group, Stack, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Component, debouncedTreeUpdate } from "@/utils/editor";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { useForm } from "@mantine/form";

export const SelectOptionsForm = ({ component }: { component: Component }) => {
  const form = useForm({
    initialValues: {
      data: component.props?.data ?? [],
      style: {
        display: component.props?.style.display,
      },
    },
  });

  const [label, setKey] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    debouncedTreeUpdate(component.id, form.values);
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
            form.setFieldValue(
              "data",
              form.values.data.concat({ label, value }),
            );
            setKey("");
            setValue("");
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
        {form.values.data.map(({ label, value }, index) => {
          return (
            <Group key={index} style={{ flexWrap: "nowrap" }}>
              <TextInput
                size="xs"
                placeholder="label"
                value={label}
                onChange={(event) => {
                  form.setValues((prev) => {
                    prev.data[index].label = event.target.value;
                    return prev;
                  });
                }}
                style={{ width: "50%" }}
              />
              <TextInput
                size="xs"
                placeholder="value"
                value={value}
                onChange={(event) => {
                  form.setValues((prev) => {
                    prev.data[index].value = event.target.value;
                    return prev;
                  });
                }}
                style={{ width: "50%" }}
              />

              <Icon
                name={ICON_DELETE}
                onClick={() => {
                  form.setValues((prev) => {
                    return prev.data.filter((_: any, i: number) => index !== i);
                  });
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
