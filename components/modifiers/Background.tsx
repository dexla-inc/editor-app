import { GradientPicker } from "@/components/GradientSelector";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect, useState } from "react";
import { AssetsTextInput } from "../AssetsTextInput";

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
    const form = useForm();

    const [backgroundSize, setBackgroundSize] = useState(
      selectedComponent?.props?.style?.backgroundSize ??
        defaultBackgroundValues.backgroundSize,
    );

    const [backgroundType, setBackgroundType] = useState("single");

    useEffect(() => {
      form.setValues(
        merge({}, defaultBackgroundValues, {
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
      );
      setBackgroundType(
        selectedComponent.props?.bg?.includes("gradient")
          ? "gradient"
          : "single",
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const setFieldValue = (key: any, value: any) => {
      form.setFieldValue(key, value);
      debouncedTreeUpdate(selectedComponentIds, { [key]: value });
    };

    return (
      <form>
        <Stack spacing="xs">
          <Stack spacing={0}>
            <TopLabel text="Background Type" />
            <SegmentedControl
              size="xs"
              data={[
                { label: "Single", value: "single" },
                { label: "Gradient", value: "gradient" },
              ]}
              value={backgroundType}
              onChange={(value) => {
                setBackgroundType(value as string);
                if (value === "single") {
                  setFieldValue("bg", "White.6");
                } else {
                  setFieldValue("bg", defaultBackgroundValues.bgGradient);
                }
              }}
            />
          </Stack>
          {backgroundType === "single" ? (
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
          ) : (
            <GradientPicker
              getValue={() => form.getInputProps("bg").value}
              setFieldValue={setFieldValue}
            />
          )}
          <AssetsTextInput
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
          <SegmentedControlInput
            label="Size"
            data={[
              { label: "Cover", value: "cover" },
              { label: "Contain", value: "contain" },
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
          {backgroundSize !== "contain" && backgroundSize !== "cover" ? (
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
          ) : (
            <TextInput
              {...form.getInputProps("backgroundSize")}
              display="none"
            />
          )}
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
          <Stack spacing={2}>
            <TopLabel text="Repeat" />
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
            <TopLabel text="Movement" />
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
