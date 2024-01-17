import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconBrush } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import BindingPopover from "../BindingPopover";

export const icon = IconBrush;
export const label = "Appearance";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();
    const [opened, { open, close, toggle }] = useDisclosure(false);

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.effects, {
          display: selectedComponent.props?.style?.display,
          cursor: selectedComponent.props?.style?.cursor,
          overflow: selectedComponent.props?.style?.overflow,
          opacity: selectedComponent.props?.style?.opacity,
          tooltip: selectedComponent.props?.tooltip,
          javascriptCode: selectedComponent.props?.javascriptCode ?? "",
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form key={selectedComponent?.id}>
        <Stack spacing="xs">
          <Group noWrap align="end" position="apart">
            <SegmentedControlInput
              styles={{ root: { width: "130px" } }}
              label="Visibility"
              data={[
                {
                  label: "Visible",
                  value: getComponentInitialDisplayValue(
                    selectedComponent.name,
                  ),
                },
                {
                  label: "Hidden",
                  value: "none",
                },
              ]}
              {...form.getInputProps("display")}
              onChange={(value) => {
                form.setFieldValue("display", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: {
                    display: value,
                  },
                });
              }}
            />
            <BindingPopover
              opened={opened}
              onTogglePopover={open}
              onClosePopover={close}
              bindingType="JavaScript"
              onChangeBindingType={() => {}}
              javascriptCode={form.values.javascriptCode as string}
              onChangeJavascriptCode={(javascriptCode: string, _: any) => {
                form.setFieldValue("javascriptCode", javascriptCode);
                debouncedTreeUpdate(selectedComponentIds, {
                  javascriptCode: javascriptCode,
                });
              }}
              onOpenPopover={open}
              onPickComponent={{}}
              onPickVariable={(variable: string) => {}}
              style="iconButton"
            />
          </Group>
          <Select
            label="Cursor"
            size="xs"
            data={[
              { label: "Auto", value: "auto" },
              { label: "Default", value: "default" },
              { label: "Pointer", value: "pointer" },
              { label: "Text", value: "text" },
              { label: "Wait", value: "wait" },
              { label: "Help", value: "help" },
              { label: "Progress", value: "progress" },
              { label: "Crosshair", value: "crosshair" },
              { label: "Copy", value: "copy" },
              { label: "Move", value: "move" },
              { label: "No-Drop", value: "no-drop" },
              { label: "Not Allowed", value: "not-allowed" },
              { label: "Zoom-In", value: "zoom-in" },
              { label: "Zoom-Out", value: "zoom-out" },
            ]}
            {...form.getInputProps("cursor")}
            onChange={(value) => {
              form.setFieldValue("cursor", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                style: { cursor: value },
              });
            }}
          />
          <Select
            label="Overflow"
            size="xs"
            data={[
              { label: "Auto", value: "auto" },
              { label: "Visible", value: "visible" },
              { label: "Hidden", value: "hidden" },
              { label: "Scroll", value: "scroll" },
              { label: "Clip", value: "clip" },
              { label: "Initial", value: "initial" },
              { label: "Inherit", value: "inherit" },
            ]}
            {...form.getInputProps("overflow")}
            onChange={(value) => {
              form.setFieldValue("overflow", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                style: { overflow: value },
              });
            }}
          />
          <NumberInput
            label="Opacity"
            size="xs"
            {...form.getInputProps("opacity")}
            precision={1}
            step={0.1}
            min={0}
            max={1}
            onChange={(value) => {
              form.setFieldValue("opacity", value as number);
              debouncedTreeUpdate(selectedComponentIds, {
                style: { opacity: value },
              });
            }}
          />

          <TextInput
            label="Tooltip"
            size="xs"
            {...form.getInputProps("tooltip")}
            onChange={(e) => {
              form.setFieldValue("tooltip", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                tooltip: e.target.value,
              });
            }}
          />

          <ThemeColorSelector
            label="Tooltip Color"
            {...form.getInputProps("tooltipColor")}
            onChange={(value: string) => {
              form.setFieldValue("tooltipColor", value);
              debouncedTreeUpdate(selectedComponentIds, {
                tooltipColor: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
