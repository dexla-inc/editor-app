import { Icon } from "@/components/Icon";
import { IconSelector } from "@/components/IconSelector";
import { withModifier } from "@/hoc/withModifier";
import { ICON_DELETE } from "@/utils/config";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { ActionIcon, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutKanban } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconLayoutKanban;
export const label = "Tab";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: { ...requiredModifiers.tab },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["value", "icon"]);

      form.setValues({
        value: data.value ?? requiredModifiers.tab.value,
        icon: data.icon ?? requiredModifiers.tab.icon,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Value"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            debouncedTreeComponentPropsUpdate("value", e.target.value);
          }}
        />
        <Group noWrap spacing="xs">
          <IconSelector
            topLabel="Icon"
            selectedIcon={form.values.icon}
            onIconSelect={(value: string) => {
              form.setFieldValue("icon", value);
              debouncedTreeComponentPropsUpdate("icon", value);
            }}
          />
          <ActionIcon
            onClick={() => {
              debouncedTreeComponentPropsUpdate("icon", null);
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
});
