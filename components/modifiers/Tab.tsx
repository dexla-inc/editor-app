import { IconSelector } from "@/components/IconSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: merge({}, requiredModifiers.tab, {
      value: selectedComponent?.props?.value,
      icon: selectedComponent?.props?.icon,
      iconColor: selectedComponent?.props?.iconColor,
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { value: e.target.value } },
            });
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.icon as string}
          onIconSelect={(value: string) => {
            form.setFieldValue("icon", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  icon: value,
                },
              },
            });
          }}
        />
        <ThemeColorSelector
          label="Icon Color"
          {...form.getInputProps("iconColor")}
          onChange={(value: string) => {
            form.setFieldValue("iconColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  iconColor: value,
                },
              },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
