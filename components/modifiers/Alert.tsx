import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { IconSelector } from "../IconSelector";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.alert, {
        color: selectedComponent.props?.color,
        icon: selectedComponent.props?.icon,
        iconColor: selectedComponent.props?.iconColor,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { color: value } },
            });
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={selectedComponent.props?.icon}
          onIconSelect={(value: string) => {
            form.setFieldValue("icon", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { icon: value } },
            });
          }}
        />
        <ThemeColorSelector
          label="Icon Color"
          {...form.getInputProps("iconColor")}
          onChange={(value: string) => {
            form.setFieldValue("iconColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { iconColor: value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
