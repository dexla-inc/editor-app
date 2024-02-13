import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { useChangeState } from "@/hooks/useChangeState";
import { useEditorStore } from "@/stores/editor";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClockHour5 } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useCallback, useEffect, useState } from "react";

export const icon = IconClockHour5;
export const label = "Countdown Button";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds, currentState }) => {
    const form = useForm();
    const theme = useEditorStore((state) => state.theme);
    const [icon, setIcon] = useState(selectedComponent.props?.icon);

    const changeIcon = useCallback(
      (value?: string, iconPosition?: string) => {
        debouncedTreeUpdate(selectedComponentIds, {
          icon: value,
          iconPosition: iconPosition,
        });
        setIcon(value);
        form.setFieldValue("icon", value);
      },
      [selectedComponentIds, form],
    );

    useEffect(() => {
      form.setValues(
        merge(
          {},
          requiredModifiers.button,
          {
            color: "Primary.6",
            textColor: "PrimaryText.6",
          },
          {
            variant: selectedComponent.props?.variant,
            size: selectedComponent?.props?.size ?? theme.inputSize,
            icon: icon,
            color: selectedComponent.props?.color,
            textColor: selectedComponent.props?.textColor,
            width: selectedComponent.props?.style?.width,
            duration: selectedComponent.props?.duration,
          },
        ),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const { setBackgroundColor } = useChangeState({});

    return (
      <form>
        <Stack spacing="xs">
          <ThemeColorSelector
            label="Background Color"
            {...form.getInputProps("color")}
            onChange={(value: string) =>
              setBackgroundColor("color", value, form, currentState)
            }
            excludeTransparent
          />
          <ThemeColorSelector
            label="Text Color"
            {...form.getInputProps("textColor")}
            onChange={(value: string) => {
              form.setFieldValue("textColor", value);
              debouncedTreeUpdate(selectedComponentIds, {
                textColor: value,
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
              debouncedTreeUpdate(selectedComponentIds, {
                style: { width: value },
              });
            }}
          />
          <IconSelector
            topLabel="Icon"
            selectedIcon={icon}
            onIconSelect={(value: string) => {
              changeIcon(
                value,
                selectedComponent.props?.iconPosition ?? "left",
              );
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
                debouncedTreeUpdate(selectedComponentIds, {
                  iconPosition: value,
                });
              }}
            />
          )}
          <SegmentedControlSizes
            label="Size"
            sizing={inputSizes}
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                size: value,
                style: { height: inputSizes[value] },
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
