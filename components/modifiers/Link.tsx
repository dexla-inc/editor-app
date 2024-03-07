import { FontSelector } from "@/components/FontSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: merge({}, requiredModifiers.link, {
      color: selectedComponent.props?.color,
      fontTag: selectedComponent.props?.fontTag,
    }),
  });

  return (
    <form>
      <Stack spacing="xs">
        <FontSelector {...form.getInputProps("fontTag")} form={form as any} />
        <ThemeColorSelector
          label="Color"
          value={form.getInputProps("color").value}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  color: value,
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
