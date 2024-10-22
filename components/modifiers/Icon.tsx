import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge(
        {},
        requiredModifiers.icon,
        { size: "md" },
        {
          color: selectedComponent.props?.color,
          bg: selectedComponent.props?.bg,
          icon: selectedComponent.props?.name,
          size: selectedComponent.props?.size,
        },
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const handleIconSelect = (value: string) => {
    form.setFieldValue("icon", value);
    debouncedTreeComponentAttrsUpdate({ attrs: { props: { name: value } } });
  };

  return (
    <form>
      <Stack spacing="xs">
        <IconSelector
          topLabel="Icon"
          selectedIcon={selectedComponent.props?.name}
          onIconSelect={handleIconSelect}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
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
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  bg: value,
                },
              },
            });
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  size: value,
                },
              },
            });
          }}
          showNone={false}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
