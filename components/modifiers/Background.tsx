import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useState } from "react";

export const icon = IconTexture;
export const label = "Background";

const extractBackgroundUrl = (backgroundImageValue: string): string => {
  const urlRegex = /url\(['"]?([^'"\(\)]+)['"]?\)/;
  const match = backgroundImageValue.match(urlRegex);

  if (match && match.length > 1) {
    return match[1];
  }

  return "";
};

const defaultBackgroundValues = requiredModifiers.background;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultBackgroundValues, {
        bg: selectedComponent?.props?.bg,
        backgroundImage: selectedComponent?.props?.style?.backgroundImage
          ? extractBackgroundUrl(
              selectedComponent?.props?.style?.backgroundImage,
            )
          : "",
        backgroundPositionX:
          selectedComponent?.props?.style?.backgroundPositionX,
        backgroundPositionY:
          selectedComponent?.props?.style?.backgroundPositionY,
        backgroundSize: selectedComponent?.props?.style?.backgroundSize,
        backgroundRepeat: selectedComponent?.props?.style?.backgroundRepeat,
      }),
    });

    const [backgroundSize, setBackgroundSize] = useState(
      selectedComponent?.props?.style?.backgroundSize ??
        defaultBackgroundValues.backgroundSize,
    );

    return (
      <form>
        <Stack spacing="xs">
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("bg")}
            onChange={(value: string) => {
              form.setFieldValue("bg", value);
              debouncedTreeUpdate(selectedComponentIds, {
                bg: value,
              });
            }}
          />
          <TextInput
            label="Image"
            size="xs"
            placeholder="https://example.com/image.png"
            {...form.getInputProps("backgroundImage")}
            onChange={(e) => {
              const value = e.target.value;
              form.setFieldValue("backgroundImage", value);

              debouncedTreeUpdate(selectedComponentIds, {
                style: { backgroundImage: `url(${value})` },
              });
            }}
          />
          <Stack spacing={2}>
            <Text size="xs" fw={500}>
              Size
            </Text>
            <SegmentedControl
              size="xs"
              data={[
                { label: "Contain", value: "contain" },
                { label: "Cover", value: "cover" },
                { label: "%", value: "100%" },
              ]}
              {...form.getInputProps("backgroundSize")}
              onChange={(value) => {
                form.setFieldValue("backgroundSize", value as any);
                setBackgroundSize(value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { backgroundSize: value },
                });
              }}
            />
          </Stack>
          {backgroundSize !== "contain" && backgroundSize !== "cover" ? (
            <>
              <UnitInput
                label="Percent"
                size="xs"
                options={[{ value: "%", label: "%" }]}
                value={backgroundSize as any}
                onChange={(value) => {
                  form.setFieldValue("backgroundSize", value as any);
                  setBackgroundSize(value as string);
                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { backgroundSize: value },
                  });
                }}
              />

              <UnitInput
                label="Position X"
                {...form.getInputProps("backgroundPositionX")}
                onChange={(value) => {
                  form.setFieldValue("backgroundPositionX", value as any);
                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { backgroundPositionX: value },
                  });
                }}
              />
              <UnitInput
                label="Position Y"
                {...form.getInputProps("backgroundPositionY")}
                onChange={(value) => {
                  form.setFieldValue("backgroundPositionY", value as any);
                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { backgroundPositionY: value },
                  });
                }}
              />
            </>
          ) : (
            <TextInput
              {...form.getInputProps("backgroundSize")}
              display="none"
            />
          )}
          <Stack spacing={2}>
            <Text size="xs" fw={500}>
              Repeat
            </Text>
            <SegmentedControl
              size="xs"
              data={[
                { label: "No", value: "no-repeat" },
                { label: "Yes", value: "repeat" },
              ]}
              {...form.getInputProps("backgroundRepeat")}
              onChange={(value) => {
                form.setFieldValue("backgroundRepeat", value as any);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { backgroundRepeat: value },
                });
              }}
            />
          </Stack>
          <Stack spacing={2}>
            <Text size="xs" fw={500}>
              Movement
            </Text>
            <SegmentedControl
              size="xs"
              data={[
                { label: "Scroll", value: "scroll" },
                { label: "Fixed", value: "fixed" },
              ]}
              {...form.getInputProps("backgroundAttachment")}
              onChange={(value) => {
                form.setFieldValue("backgroundAttachment", value as any);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { backgroundAttachment: value },
                });
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  },
);
