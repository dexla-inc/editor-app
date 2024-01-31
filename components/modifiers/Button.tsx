import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useCallback, useEffect, useState } from "react";

export const icon = IconClick;
export const label = "Button";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
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
            //compact: theme.hasCompactButtons?.toString(),
          },
          {
            type: selectedComponent.props?.type,
            variant: selectedComponent.props?.variant,
            size: selectedComponent?.props?.size ?? theme.inputSize,
            icon: icon,
            //compact: selectedComponent.props?.compact,
            color: selectedComponent.props?.color,
            textColor: selectedComponent.props?.textColor,
            width: selectedComponent.props?.style?.width,
          },
        ),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          {/* <Select
            label="Variant"
            size="xs"
            data={[
              { label: "Filled", value: "filled" },
              { label: "Light", value: "light" },
              { label: "Outline", value: "outline" },
              { label: "Default", value: "default" },
              { label: "Subtle", value: "subtle" },
            ]}
            {...form.getInputProps("variant")}
            onChange={(value) => {
              form.setFieldValue("variant", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                variant: value,
              });
            }}
          /> */}
          <SegmentedControlInput
            label="Type"
            data={[
              { label: "Button", value: "button" },
              { label: "Submit", value: "submit" },
            ]}
            {...form.getInputProps("type")}
            onChange={(value) => {
              form.setFieldValue("type", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                type: value,
              });
            }}
          />
          <ThemeColorSelector
            label="Background Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponentIds, {
                color: value,
              });
            }}
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
          {/* <SegmentedControlYesNo
            label="Compact"
            {...form.getInputProps("compact")}
            onChange={(value) => {
              form.setFieldValue("compact", value);
              debouncedTreeUpdate(selectedComponentIds, {
                compact: value,
              });
            }}
          /> */}

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
