import { GradientPicker } from "@/components/GradientSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { useChangeState } from "@/hooks/components/useChangeState";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect, useState } from "react";
import { FontSelector } from "@/components/FontSelector";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { badgeSizes } from "@/utils/defaultSizes";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  const [backgroundType, setBackgroundType] = useState("single");

  useEffect(() => {
    form.setValues(
      merge(
        {},
        requiredModifiers.badge,
        { size: "md" },
        {
          type: selectedComponent.props?.type,
          size: selectedComponent.props?.size,
          radius: selectedComponent.props?.radius,
          color: selectedComponent.props?.color,
          bg: selectedComponent.props?.bg,
          fontTag: selectedComponent.props?.fontTag ?? "P",
        },
      ),
    );

    setBackgroundType(
      selectedComponent.props?.bg?.includes("gradient") ? "gradient" : "single",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeComponentAttrsUpdate({ attrs: { props: { [key]: value } } });
  };

  const { setBackgroundColor } = useChangeState({});

  return (
    <form>
      <Stack spacing="xs">
        <SegmentedControlSizes
          label="Size"
          sizing={badgeSizes}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  size: value,
                  style: { height: badgeSizes[value] },
                },
              },
            });
          }}
        />
        <SizeSelector
          label="Radius"
          {...form.getInputProps("radius")}
          onChange={(value) => {
            form.setFieldValue("radius", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  radius: value,
                },
              },
            });
          }}
        />
        <FontSelector
          label="Font tag"
          {...form.getInputProps("fontTag")}
          form={form as any}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  color: value,
                },
              },
            });
          }}
        />
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
                setFieldValue("bg", requiredModifiers.background.bgGradient);
              }
            }}
          />
        </Stack>
        {backgroundType === "single" ? (
          <ThemeColorSelector
            label="Background"
            {...form.getInputProps("bg")}
            onChange={(value: string) => setBackgroundColor("bg", value, form)}
          />
        ) : (
          <GradientPicker
            getValue={() => form.getInputProps("bg").value}
            setFieldValue={setFieldValue}
          />
        )}
      </Stack>
    </form>
  );
});

export default Modifier;
