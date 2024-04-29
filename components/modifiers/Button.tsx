import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
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
import { useCallback, useEffect, useState } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useThemeStore((state) => state.theme);
  const [icon, setIcon] = useState(selectedComponent.props?.icon);
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.button, {
        type: selectedComponent.props?.type,
        variant: selectedComponent.props?.variant,
        size: selectedComponent?.props?.size ?? theme.inputSize,
        icon: icon,
        color: selectedComponent.props?.color ?? "Primary.6",
        textColor: selectedComponent.props?.textColor ?? "PrimaryText.6",
        width: selectedComponent.props?.style?.width,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const changeIcon = useCallback(
    (value?: string, iconPosition?: string) => {
      debouncedTreeComponentAttrsUpdate({
        attrs: {
          props: {
            icon: value,
            iconPosition: iconPosition,
          },
        },
      });
      setIcon(value);
      form.setFieldValue("icon", value);
    },
    [form],
  );

  const { setBackgroundColor } = useChangeState({});

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
                  style: { height: inputSizes[value] },
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
        <ThemeColorSelector
          label="Text Color"
          {...form.getInputProps("textColor")}
          onChange={(value: string) => {
            form.setFieldValue("textColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  textColor: value,
                },
              },
            });
          }}
        />
        <SegmentedControlInput
          label="Width"
          data={[
            { label: "Fit Content", value: "fit-content" },
            { label: "100%", value: "100%" },
          ]}
          {...form.getInputProps("width")}
          onChange={(value) => {
            form.setFieldValue("width", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  style: { width: value },
                },
              },
            });
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={icon}
          onIconSelect={(value: string) => {
            changeIcon(value, selectedComponent.props?.iconPosition ?? "left");
          }}
          onIconDelete={() => {
            changeIcon(undefined, undefined);
          }}
        />
        {icon && (
          <SegmentedControlInput
            label="Icon Position"
            data={[
              { label: "Left", value: "left" },
              { label: "Right", value: "right" },
            ]}
            {...form.getInputProps("iconPosition")}
            onChange={(value) => {
              form.setFieldValue("iconPosition", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    iconPosition: value,
                  },
                },
              });
            }}
          />
        )}
      </Stack>
    </form>
  );
});

export default Modifier;
