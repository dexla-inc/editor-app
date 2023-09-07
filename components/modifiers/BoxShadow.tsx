import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { UnitInput } from "@/components/UnitInput";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeUpdate, getComponentById } from "@/utils/editor";
import { Flex, SegmentedControl, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconShadow } from "@tabler/icons-react";
import { useEffect } from "react";

export const icon = IconShadow;
export const label = "Shadow";

export const defaultBoxShadowValues = {
  inset: "",
  xOffset: "0px",
  yOffset: "0px",
  blur: "0px",
  spread: "0px",
  color: "Black.9",
};

export const Modifier = () => {
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
    initialValues: defaultBoxShadowValues,
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;

      // Parsing existing boxShadow style into separate parts
      const [inset, xOffset, yOffset, blur, spread, color] =
        (style.boxShadow ?? "").split(" ") || defaultBoxShadowValues;

      form.setValues({
        inset: inset ?? defaultBoxShadowValues.inset,
        xOffset: xOffset ?? defaultBoxShadowValues.xOffset,
        yOffset: yOffset ?? defaultBoxShadowValues.yOffset,
        blur: blur ?? defaultBoxShadowValues.blur,
        spread: spread ?? defaultBoxShadowValues.spread,
        color: color ?? defaultBoxShadowValues.color,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form key={selectedComponentId}>
      <Stack spacing="xs">
        <Stack spacing={0}>
          <Text size="xs" fw={500}>
            Offset
          </Text>
          <SegmentedControl
            size="xs"
            data={[
              { label: "Outside", value: "" },
              { label: "Inside", value: "inset" },
            ]}
            {...form.getInputProps("inset")}
            onChange={(value) => {
              form.setFieldValue("inset", value as string);
              const boxShadow = `${value} ${form.values.xOffset} ${form.values.yOffset} ${form.values.blur} ${form.values.spread} ${form.values.color}`;

              debouncedTreeUpdate(selectedComponentId as string, {
                style: { boxShadow },
              });
            }}
          />
        </Stack>
        <Flex gap="xs">
          <UnitInput
            label="X Offset"
            {...form.getInputProps("xOffset")}
            onChange={(value) => {
              form.setFieldValue("xOffset", value as string);
              const boxShadow = `${form.values.inset} ${value} ${form.values.yOffset} ${form.values.blur} ${form.values.spread} ${form.values.color}`;

              debouncedTreeUpdate(selectedComponentId as string, {
                style: { boxShadow },
              });
            }}
            options={[
              { value: "px", label: "PX" },
              { value: "rem", label: "REM" },
              { value: "%", label: "%" },
            ]}
          />
          <UnitInput
            label="Y Offset"
            {...form.getInputProps("yOffset")}
            onChange={(value) => {
              form.setFieldValue("yOffset", value as string);
              const boxShadow = `${form.values.inset} ${form.values.xOffset} ${value} ${form.values.blur} ${form.values.spread} ${form.values.color}`;

              debouncedTreeUpdate(selectedComponentId as string, {
                style: { boxShadow },
              });
            }}
            options={[
              { value: "px", label: "PX" },
              { value: "rem", label: "REM" },
              { value: "%", label: "%" },
            ]}
          />
        </Flex>
        <Flex gap="xs">
          <UnitInput
            label="Blur"
            {...form.getInputProps("blur")}
            onChange={(value) => {
              form.setFieldValue("blur", value as string);
              const boxShadow = `${form.values.inset} ${form.values.xOffset} ${form.values.yOffset} ${value} ${form.values.spread} ${form.values.color}`;

              debouncedTreeUpdate(selectedComponentId as string, {
                style: { boxShadow },
              });
            }}
            options={[
              { value: "px", label: "PX" },
              { value: "rem", label: "REM" },
              { value: "%", label: "%" },
            ]}
          />
          <UnitInput
            label="Spread"
            {...form.getInputProps("spread")}
            onChange={(value) => {
              form.setFieldValue("spread", value as string);
              const boxShadow = `${form.values.inset} ${form.values.xOffset} ${form.values.yOffset} ${form.values.blur} ${value} ${form.values.color}`;

              debouncedTreeUpdate(selectedComponentId as string, {
                style: { boxShadow },
              });
            }}
            options={[
              { value: "px", label: "PX" },
              { value: "rem", label: "REM" },
              { value: "%", label: "%" },
            ]}
          />
        </Flex>
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            const boxShadow = `${form.values.inset} ${form.values.xOffset} ${form.values.yOffset} ${form.values.blur} ${form.values.spread} ${value}`;

            debouncedTreeUpdate(selectedComponentId as string, {
              style: { boxShadow },
            });
          }}
        />
      </Stack>
    </form>
  );
};
