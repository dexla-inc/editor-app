import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";

const defaultAvatarValues = {
  variant: "filled",
  src: "",
  radius: "",
  size: "md",
  color: "Primary.6",
  value: "",
};

export const icon = IconUser;
export const label = "Avatar";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultAvatarValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "variant",
        "src",
        "radius",
        "size",
        "color",
        "children",
      ]);
      form.setValues({
        variant: data.variant ?? defaultAvatarValues.variant,
        src: data.src ?? defaultAvatarValues.src,
        radius: data.radius ?? defaultAvatarValues.radius,
        size: data.size ?? defaultAvatarValues.size,
        color: data.color ?? defaultAvatarValues.color,
        value: data.children ?? defaultAvatarValues.value,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const data: Record<string, string> = {
    Default: "default",
    White: "white",
    Filled: "filled",
    Light: "light",
    Outline: "outline",
    Transparent: "transparent",
  };

  const avatarSize: Record<string, string> = {
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
  };

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Text"
          type="text"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            const val = !!e.target.value ? e.target.value : null;
            debouncedTreeComponentPropsUpdate("children", val);
          }}
        />
        <TextInput
          label="Source"
          placeholder="https://example.com/image.png"
          type="url"
          size="xs"
          {...form.getInputProps("src")}
          onChange={(e) => {
            form.setFieldValue("src", e.target.value);
            debouncedTreeComponentPropsUpdate("src", e.target.value);
          }}
        />
        <Select
          label="Variant"
          size="xs"
          data={Object.keys(data).map((key) => ({
            label: key,
            value: data[key],
          }))}
          {...form.getInputProps("variant")}
          onChange={(value) => {
            form.setFieldValue("variant", value as string);
            debouncedTreeComponentPropsUpdate("variant", value);
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentPropsUpdate("color", value);
          }}
        />
        <Select
          label="Size"
          size="xs"
          data={Object.keys(avatarSize).map((key) => ({
            label: key,
            value: avatarSize[key],
          }))}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value);
          }}
        />
        <Select
          label="Radius"
          size="xs"
          data={Object.keys(avatarSize).map((key) => ({
            label: key,
            value: avatarSize[key],
          }))}
          {...form.getInputProps("radius")}
          onChange={(value) => {
            form.setFieldValue("radius", value as string);
            debouncedTreeComponentPropsUpdate("radius", value);
          }}
        />
      </Stack>
    </form>
  );
});
