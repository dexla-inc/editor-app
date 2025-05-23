import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { TopLabel } from "@/components/TopLabel";
import { UrlOrPageSelector } from "@/components/UrlOrPageSelector";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { useThemeStore } from "@/stores/theme";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconArrowsMoveVertical,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useThemeStore((state) => state.theme);
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.autocomplete, {
        size: selectedComponent?.props?.size ?? theme.inputSize,
        iconName: selectedComponent?.props?.iconName,
        data: selectedComponent?.props?.data,
        withAsterisk: selectedComponent?.props?.withAsterisk,
        customerFooter: selectedComponent?.props?.customerFooter || false,
        customText: selectedComponent?.props?.customText,
        customLinkText: selectedComponent?.props?.customLinkText,
        customLinkType: selectedComponent?.props?.customLinkType,
        customLinkUrl: selectedComponent?.props?.customLinkUrl,
        dropdownPosition: selectedComponent?.props?.dropdownPosition,
        bg: selectedComponent?.props?.bg,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeComponentAttrsUpdate({ attrs: { props: { [key]: value } } });
  };

  return (
    <form>
      <Stack spacing="xs">
        <SegmentedControlSizes
          label="Size"
          sizing={inputSizes}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  size: value,
                  style: { height: inputSizes[value] },
                },
              },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(value) => {
            form.setFieldValue("withAsterisk", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  withAsterisk: value,
                },
              },
            });
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.iconName as string}
          onIconSelect={(iconName: string) => {
            form.setFieldValue("iconName", iconName);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  iconName,
                },
              },
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
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  bg: value,
                },
              },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Custom Footer"
          {...form.getInputProps("customerFooter")}
          onChange={(value) => {
            setFieldValue("customerFooter", value);
          }}
        />
        {selectedComponent?.props?.customerFooter && (
          <Stack bg="black" p="xs" spacing="xs" sx={{ borderRadius: 4 }}>
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
            <UrlOrPageSelector form={form} />
          </Stack>
        )}
      </Stack>
    </form>
  );
});

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

export default Modifier;
