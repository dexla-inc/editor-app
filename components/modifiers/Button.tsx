import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import { useEffect } from "react";

export const icon = IconClick;
export const label = "Button";

export const defaultInputValues = {
  value: "New Button",
  type: "button",
  variant: "filled",
  size: "md",
  color: "Primary.6",
  textColor: "White.0",
  leftIcon: "",
};

export const Modifier = () => {
  const theme = useEditorStore((state) => state.theme);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponentId) {
      const {
        style = {},
        children,
        type,
        size,
        color,
        variant,
        textColor,
        leftIcon,
      } = componentProps;
      form.setValues({
        value: children ?? defaultInputValues.value,
        type: type ?? defaultInputValues.type,
        variant: variant ?? defaultInputValues.variant,
        size: size ?? defaultInputValues.size,
        color: color ?? defaultInputValues.color,
        textColor: textColor ?? defaultInputValues.textColor,
        icon: leftIcon ?? defaultInputValues.leftIcon,
        ...style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Value"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            debouncedTreeComponentPropsUpdate("children", e.target.value);
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
            debouncedTreeComponentPropsUpdate("type", value as string);
          }}
        />
        <Select
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
            debouncedTreeComponentPropsUpdate("variant", value as string);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value as string);
          }}
        />
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentPropsUpdate("color", value);
          }}
        />
        <ThemeColorSelector
          label="Text Color"
          {...form.getInputProps("textColor")}
          onChange={(value: string) => {
            form.setFieldValue("textColor", value);
            debouncedTreeComponentPropsUpdate("textColor", value);
            const [color, index] = value.split(".");
            // @ts-ignore
            const _value = theme.colors[color][index];
            debouncedTreeComponentPropsUpdate("styles", {
              label: { color: _value },
            });
          }}
        />
        {/* Adding a react component as a property doesn't work -
        Error: Objects are not valid as a React child (found: object with keys {key, ref, props, _owner, _store}). 
        If you meant to render a collection of children, use an array instead. */}
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.leftIcon}
          onIconSelect={(value: string) => {
            form.setFieldValue("leftIcon", value);
            debouncedTreeComponentPropsUpdate("leftIcon", value);
          }}
        />
      </Stack>
    </form>
  );
};
