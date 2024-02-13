import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { useChangeState } from "@/hooks/useChangeState";
import { useEditorStore } from "@/stores/editor";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { CustomTextArea } from "../CustomTextArea";
import { TopLabel } from "../TopLabel";
import { UnitInput } from "../UnitInput";

export const icon = IconClick;
export const label = "Countdown Button";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds, currentState }) => {
    const form = useForm();
    const theme = useEditorStore((state) => state.theme);

    useEffect(() => {
      form.setValues(
        merge(
          {},
          requiredModifiers.button,
          {
            color: "Primary.6",
            textColor: "PrimaryText.6",
          },
          {
            type: selectedComponent.props?.type,
            variant: selectedComponent.props?.variant,
            size: selectedComponent?.props?.size ?? theme.inputSize,
            color: selectedComponent.props?.color,
            textColor: selectedComponent.props?.textColor,
            width: selectedComponent.props?.style?.width,
            startingNumber:
              selectedComponent.props?.startingNumber ?? "0seconds",
            children:
              selectedComponent.props?.children ?? "Begin count in 20seconds",
            enabledText: selectedComponent.props?.enabledText ?? "",
          },
        ),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const { setBackgroundColor } = useChangeState({});

    return (
      <form>
        <Stack spacing="xs">
          <UnitInput
            label="Starting number"
            {...form.getInputProps("startingNumber")}
            options={[
              { label: "secs", value: "seconds" },
              { label: "mins", value: "minutes" },
            ]}
            disabledUnits={[
              "%",
              "auto",
              "fit-content",
              "px",
              "rem",
              "vh",
              "vw",
            ]}
            onChange={(value) => {
              form.setFieldValue("startingNumber", value);
              debouncedTreeUpdate(selectedComponentIds, {
                startingNumber: value,
              });
            }}
          />
          {/* <TextInput
            label="Disabled Text"
            {...form.getInputProps("children")}
            onChange={(e) => {
              form.setFieldValue("children", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                children: e.target.value,
              });
            }}
          /> */}
          <Stack spacing={5}>
            <TopLabel text="Disabled Text" />
            <CustomTextArea
              value={form.getInputProps("children").value}
              componentProps={selectedComponent}
              onChange={(code: string) => {
                form.setFieldValue("children", code);
                debouncedTreeUpdate(selectedComponentIds, {
                  children: code,
                });
              }}
            />
          </Stack>
          <TextInput
            label="Enabled Text"
            {...form.getInputProps("enabledText")}
            onChange={(e) => {
              form.setFieldValue("enabledText", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                enabledText: e.target.value,
              });
            }}
          />
          <ThemeColorSelector
            label="Background Color"
            {...form.getInputProps("color")}
            onChange={(value: string) =>
              setBackgroundColor("color", value, form, currentState)
            }
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
