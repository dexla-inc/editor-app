import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import {
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect, useState } from "react";

export const icon = IconTexture;
export const label = "Background";

const defaultBackgroundValues = {
  bg: "transparent",
  backgroundImage: "",
  backgroundSize: "contain",
  backgroundRepeat: "repeat",
  backgroundPositionX: "0%",
  backgroundPositionY: "0%",
  backgroundAttachment: "scroll",
};

const extractBackgroundUrl = (backgroundImageValue: string): string => {
  const urlRegex = /url\(['"]?([^'"\(\)]+)['"]?\)/;
  const match = backgroundImageValue.match(urlRegex);

  if (match && match.length > 1) {
    return match[1];
  }

  return "";
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultBackgroundValues,
  });

  const [backgroundSize, setBackgroundSize] = useState(
    defaultBackgroundValues.backgroundSize,
  );

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["bg", "style"]);
      form.setValues({
        bg: data.bg ?? "transparent",
        backgroundImage: data.style?.backgroundImage
          ? extractBackgroundUrl(data.style.backgroundImage)
          : "",
        backgroundPositionX: data.style?.backgroundPositionX,
        backgroundPositionY: data.style?.backgroundPositionY,
        backgroundSize: data.style?.backgroundSize,
        backgroundRepeat: data.style?.backgroundRepeat,
      });
      setBackgroundSize(data.style?.backgroundSize);
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              bg: value,
            });
          }}
        />
        <TextInput
          label="Image URL"
          size="xs"
          placeholder="https://example.com/image.png"
          {...form.getInputProps("backgroundImage")}
          onChange={(e) => {
            const value = e.target.value;
            form.setFieldValue("backgroundImage", value);

            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { backgroundImage: `url(${value})` },
            });
          }}
        />
        <Select
          label="Size"
          size="xs"
          data={[
            { label: "Contain", value: "contain" },
            { label: "Cover", value: "cover" },
            { label: "Percent", value: "100%" },
          ]}
          onChange={(value) => {
            form.setFieldValue("backgroundSize", value as any);
            setBackgroundSize(value as string);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { backgroundSize: value },
            });
          }}
        />
        {backgroundSize !== "contain" && backgroundSize !== "cover" ? (
          <UnitInput
            label="Percent"
            size="xs"
            options={[{ value: "%", label: "%" }]}
            value={backgroundSize as any}
            onChange={(value) => {
              form.setFieldValue("backgroundSize", value as any);
              setBackgroundSize(value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { backgroundSize: value },
              });
            }}
          />
        ) : (
          <TextInput {...form.getInputProps("backgroundSize")} display="none" />
        )}
        <Stack spacing={2}>
          <Text size="xs" fw={500}>
            Repeat
          </Text>
          <SegmentedControl
            size="xs"
            data={[
              { label: "No Repeat", value: "no-repeat" },
              { label: "Repeat", value: "repeat" },
            ]}
            {...form.getInputProps("backgroundRepeat")}
            onChange={(value) => {
              form.setFieldValue("backgroundRepeat", value as any);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { backgroundRepeat: value },
              });
            }}
          />
        </Stack>
        <UnitInput
          label="Position X"
          {...form.getInputProps("backgroundPositionX")}
          onChange={(value) => {
            form.setFieldValue("backgroundPositionX", value as any);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { backgroundPositionX: value },
            });
          }}
        />
        <UnitInput
          label="Position Y"
          {...form.getInputProps("backgroundPositionY")}
          onChange={(value) => {
            form.setFieldValue("backgroundPositionY", value as any);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { backgroundPositionY: value },
            });
          }}
        />
        <Select
          label="Attachment"
          size="xs"
          data={[
            { label: "Scroll", value: "scroll" },
            { label: "Fixed", value: "fixed" },
          ]}
          {...form.getInputProps("backgroundAttachment")}
          onChange={(value) => {
            form.setFieldValue("backgroundAttachment", value as any);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { backgroundAttachment: value },
            });
          }}
        />
      </Stack>
    </form>
  );
});
