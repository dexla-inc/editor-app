import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconClick;
export const label = "Button";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const theme = useEditorStore((state) => state.theme);
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge(
          {},
          requiredModifiers.button,
          {
            color: "Primary.6",
            textColor: "PrimaryText.6",
            compact: theme.hasCompactButtons,
          },
          {
            value: selectedComponent.props?.children,
            type: selectedComponent.props?.type,
            variant: selectedComponent.props?.variant,
            size: selectedComponent.props?.size,
            icon: selectedComponent.props?.leftIcon,
            compact: selectedComponent.props?.compact,
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
          <TextInput
            label="Value"
            size="xs"
            {...form.getInputProps("value")}
            onChange={(e) => {
              form.setFieldValue("value", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                children: e.target.value,
              });
            }}
          />
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
          <Stack spacing={2}>
            <TopLabel text="Width" />
            <SegmentedControl
              size="xs"
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
          </Stack>
          <SwitchSelector
            topLabel="Compact"
            {...form.getInputProps("compact")}
            onChange={(event) => {
              form.setFieldValue("compact", event.currentTarget.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                compact: event.currentTarget.checked,
              });
            }}
          />
          <Select
            label="Type"
            size="xs"
            data={[
              { label: "button", value: "button" },
              { label: "submit", value: "submit" },
            ]}
            {...form.getInputProps("type")}
            onChange={(value) => {
              form.setFieldValue("type", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                type: value,
              });
            }}
          />
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                size: value,
              });
            }}
          />
          {/* Adding a react component as a property doesn't work -
        Error: Objects are not valid as a React child (found: object with keys {key, ref, props, _owner, _store}). 
        If you meant to render a collection of children, use an array instead. */}
          <IconSelector
            topLabel="Icon"
            selectedIcon={selectedComponent.props?.leftIcon}
            onIconSelect={(value: string) => {
              form.setFieldValue("leftIcon", value);
              debouncedTreeUpdate(selectedComponentIds, {
                leftIcon: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
