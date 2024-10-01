import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useThemeStore } from "@/stores/theme";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useThemeStore((state) => state.theme);
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.buttonIcon, {
        size: selectedComponent?.props?.size ?? theme.inputSize,
        color: selectedComponent.props?.color,
        iconName: selectedComponent.props?.iconName,
        iconSize: selectedComponent.props?.iconSize,
        iconColor: selectedComponent.props?.iconColor,
        type: selectedComponent.props?.type,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);
  const { setBackgroundColor } = useChangeState({});

  const handleIconPropsChange = (key: string, value: string) => {
    form.setFieldValue(key, value);
    debouncedTreeComponentAttrsUpdate({ attrs: { props: { [key]: value } } });
  };

  return (
    <form>
      <Stack spacing="xs">
        <SegmentedControlSizes
          label="Size"
          sizing={inputSizes}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  size: value,
                  style: {
                    height: inputSizes[value],
                    width: inputSizes[value],
                  },
                },
              },
            });
          }}
        />
        <SegmentedControlInput
          label="Type"
          data={[
            { label: "Button", value: "button" },
            { label: "Submit", value: "submit" },
          ]}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  type: value,
                },
              },
            });
          }}
        />
        <ThemeColorSelector
          label="Button Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => setBackgroundColor("color", value, form)}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={selectedComponent.props?.iconName}
          onIconSelect={(value) => handleIconPropsChange("iconName", value)}
        />
        <ThemeColorSelector
          label="Icon Color"
          {...form.getInputProps("iconColor")}
          onChange={(value: string) =>
            handleIconPropsChange("iconColor", value)
          }
        />
        <SizeSelector
          label="Icon Size"
          {...form.getInputProps("iconSize")}
          onChange={(value: string) => handleIconPropsChange("iconSize", value)}
          showNone={false}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
