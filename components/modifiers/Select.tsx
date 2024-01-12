import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconArrowsMoveVertical,
  IconSelect,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { TopLabel } from "../TopLabel";
import { StylingPaneItemIcon } from "./StylingPaneItemIcon";

export const icon = IconSelect;
export const label = "Select";

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

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.select, {
          size: selectedComponent?.props?.size,
          placeholder: selectedComponent?.props?.placeholder,
          icon: selectedComponent?.props?.icon,
          data: selectedComponent?.props?.data,
          withAsterisk: selectedComponent?.props?.withAsterisk,
          clearable: selectedComponent?.props?.clearable,
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
          <SwitchSelector
            topLabel="Clearable"
            checked={form.getInputProps("clearable").value}
            onChange={(e) =>
              setFieldValue("clearable", e.currentTarget.checked)
            }
          />
          <TextInput
            label="Placeholder"
            size="xs"
            {...form.getInputProps("placeholder")}
            onChange={(e) => {
              setFieldValue("placeholder", e.target.value);
            }}
          />
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(value) => {
              setFieldValue("size", value as string);
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
          <TextInput
            label="Custom Link Url"
            size="xs"
            {...form.getInputProps("customLinkUrl")}
            onChange={(e) => {
              setFieldValue("customLinkUrl", e.target.value);
            }}
          />
        </Stack>
      </form>
    );
  },
);
