import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { TopLabel } from "@/components/TopLabel";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconArrowsMoveVertical,
  IconInputSearch,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { IconSelector } from "../IconSelector";

export const icon = IconInputSearch;
export const label = "Autocomplete";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();
    const theme = useEditorStore((state) => state.theme);
    const pages = useEditorStore((state) => state.pages);

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.autocomplete, {
          size: selectedComponent?.props?.size ?? theme.inputSize,
          placeholder: selectedComponent?.props?.placeholder,
          icon: selectedComponent?.props?.icon,
          data: selectedComponent?.props?.data,
          withAsterisk: selectedComponent?.props?.withAsterisk,
          customText: selectedComponent?.props?.customText,
          customLinkText: selectedComponent?.props?.customLinkText,
          customLinkUrl: selectedComponent?.props?.customLinkUrl,
          dropdownPosition: selectedComponent?.props?.dropdownPosition,
        }),
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
          <TextInput
            label="Placeholder"
            size="xs"
            {...form.getInputProps("placeholder")}
            onChange={(e) => {
              setFieldValue("placeholder", e.target.value);
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
          <IconSelector
            topLabel="Icon"
            selectedIcon={(form.values.icon as any)?.props?.name}
            onIconSelect={(iconName: string) => {
              const icon = { props: { name: iconName } };
              form.setFieldValue("icon.props.name", iconName);
              debouncedTreeUpdate(selectedComponentIds, {
                icon,
              });
            }}
          />
          <Stack spacing={2}>
            <TopLabel text="Dropdown Position" />
            <SegmentedControl
              size="xs"
              data={dropdownData}
              styles={{
                label: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                },
              }}
              {...form.getInputProps("dropdownPosition")}
              onChange={(value) => {
                setFieldValue("dropdownPosition", value);
              }}
            />
          </Stack>
          <TextInput
            label="Custom Text"
            size="xs"
            {...form.getInputProps("customText")}
            onChange={(e) => {
              setFieldValue("customText", e.target.value);
            }}
          />
          <TextInput
            label="Custom Link Description"
            size="xs"
            {...form.getInputProps("customLinkText")}
            onChange={(e) => {
              setFieldValue("customLinkText", e.target.value);
            }}
          />
          <Select
            label="Custom Page Link"
            size="xs"
            {...form.getInputProps("customLinkUrl")}
            onChange={(value) => {
              setFieldValue("customLinkUrl", value);
            }}
            data={pages.map((page) => ({
              label: page.title,
              value: page.id,
            }))}
          />
        </Stack>
      </form>
    );
  },
);

const dropdownData = [
  {
    label: (
      <StylingPaneItemIcon label="Top" icon={<IconArrowBarUp size={14} />} />
    ),
    value: "top",
  },
  {
    label: (
      <StylingPaneItemIcon
        label="Bottom"
        icon={<IconArrowBarDown size={14} />}
      />
    ),
    value: "bottom",
  },
  {
    label: (
      <StylingPaneItemIcon
        label="Flip"
        icon={<IconArrowsMoveVertical size={14} />}
      />
    ),
    value: "flip",
  },
];
