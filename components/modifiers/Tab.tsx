import { Icon } from "@/components/Icon";
import { IconSelector } from "@/components/IconSelector";
import { withModifier } from "@/hoc/withModifier";
import { ICON_DELETE } from "@/utils/config";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { ActionIcon, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutKanban } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconLayoutKanban;
export const label = "Tab";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, requiredModifiers.tab, {
        value: selectedComponent?.props?.value,
        icon: selectedComponent?.props?.icon,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Value"
            size="xs"
            {...form.getInputProps("value")}
            onChange={(e) => {
              form.setFieldValue("value", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                value: e.target.value,
              });
            }}
          />
          <Group noWrap spacing="xs">
            <IconSelector
              topLabel="Icon"
              selectedIcon={form.values.icon}
              onIconSelect={(value: string) => {
                form.setFieldValue("icon", value);
                debouncedTreeUpdate(selectedComponentIds, {
                  icon: value,
                });
              }}
            />
            <ActionIcon
              onClick={() => {
                debouncedTreeUpdate(selectedComponentIds, {
                  icon: null,
                });
              }}
              variant="light"
              radius="xl"
            >
              <Icon name={ICON_DELETE} />
            </ActionIcon>
          </Group>
        </Stack>
      </form>
    );
  },
);
