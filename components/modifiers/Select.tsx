import { IconSelector } from "@/components/IconSelector";
import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
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
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useThemeStore((state) => state.theme);
  const form = useForm();
  useEffect(() => {
    let icon = selectedComponent?.props?.icon;
    if (isEmpty(icon)) {
      icon = "";
    }
    form.setValues(
      merge({}, requiredModifiers.select, {
        size: selectedComponent?.props?.size ?? theme.inputSize,
        icon,
        data: selectedComponent?.props?.data,
        withAsterisk: selectedComponent?.props?.withAsterisk,
        clearable: selectedComponent?.props?.clearable,
        searchable: selectedComponent?.props?.searchable,
        multiSelect: selectedComponent?.props?.multiSelect,
        openInEditor: selectedComponent?.props?.openInEditor || false,
        customerFooter: selectedComponent?.props?.customerFooter || false,
        customText: selectedComponent?.props?.customText,
        customLinkText: selectedComponent?.props?.customLinkText,
        customLinkType: selectedComponent?.props?.customLinkType,
        customLinkUrl: selectedComponent?.props?.customLinkUrl,
        dropdownPosition: selectedComponent?.props?.dropdownPosition,
        maxDropdownHeight:
          selectedComponent?.props?.maxDropdownHeight ?? "auto",
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
                  style: { minHeight: inputSizes[value] },
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
        <SegmentedControlYesNo
          label="Multiple Select"
          {...form.getInputProps("multiSelect")}
          onChange={(value) => {
            form.setFieldValue("multiSelect", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  multiSelect: value,
                },
              },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Open in Editor"
          {...form.getInputProps("openInEditor")}
          onChange={(value) => {
            form.setFieldValue("openInEditor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  openInEditor: value,
                },
              },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Searchable"
          {...form.getInputProps("searchable")}
          onChange={(value) => {
            form.setFieldValue("searchable", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  searchable: value,
                },
              },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Clearable"
          {...form.getInputProps("clearable")}
          onChange={(value) => {
            form.setFieldValue("clearable", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  clearable: value,
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
        <UnitInput
          label="Dropdown Max Height"
          {...form.getInputProps("maxDropdownHeight")}
          options={[
            { value: "px", label: "PX" },
            { value: "auto", label: "auto" },
          ]}
          onChange={(value) => {
            form.setFieldValue("maxDropdownHeight", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  maxDropdownHeight: value,
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
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.icon as string}
          onIconSelect={(value: string) => {
            setFieldValue("icon", value);
          }}
          onIconDelete={() => {
            setFieldValue("icon", null);
          }}
        />
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
