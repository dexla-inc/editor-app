import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { inputSizes, radiusSizes } from "@/utils/defaultSizes";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlSizes } from "../SegmentedControlSizes";

export const icon = IconUser;
export const label = "Avatar";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();
    const theme = useEditorStore((state) => state.theme);

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.avatar, {
          variant: selectedComponent.props?.variant,
          radius: selectedComponent.props?.radius,
          size: selectedComponent.props?.size ?? theme.inputSize,
          color: selectedComponent.props?.color,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const variantOptions: Record<string, string> = {
      Default: "default",
      White: "white",
      Filled: "filled",
      Light: "light",
      Outline: "outline",
      Transparent: "transparent",
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
              debouncedTreeUpdate(selectedComponentIds, {
                size: value,
                style: { height: inputSizes[value], width: inputSizes[value] },
              });
            }}
          />
          <Select
            label="Variant"
            size="xs"
            data={Object.keys(variantOptions).map((key) => ({
              label: key,
              value: variantOptions[key],
            }))}
            {...form.getInputProps("variant")}
            onChange={(value) => {
              form.setFieldValue("variant", value as string);
              debouncedTreeUpdate(selectedComponentIds, { variant: value });
            }}
          />
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponentIds, { color: value });
            }}
          />
          <SegmentedControlSizes
            label="Radius"
            sizing={radiusSizes}
            {...form.getInputProps("radius")}
            onChange={(value) => {
              form.setFieldValue("radius", value as string);
              debouncedTreeUpdate(selectedComponentIds, { radius: value });
            }}
          />
          <SizeSelector
            label="Radius"
            {...form.getInputProps("radius")}
            onChange={(value) => {
              form.setFieldValue("radius", value as string);
              debouncedTreeUpdate(selectedComponentIds, { radius: value });
            }}
          />
        </Stack>
      </form>
    );
  },
);
