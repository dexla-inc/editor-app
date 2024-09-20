import { Icon } from "@/components/Icon";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import {
  Button,
  Flex,
  Group,
  NumberInput,
  Select,
  SelectItem,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.effects, {
        cursor: selectedComponent.props?.style?.cursor,
        overflow: selectedComponent.props?.style?.overflow,
        opacity: selectedComponent.props?.style?.opacity,
        javascriptCode: selectedComponent.props?.javascriptCode ?? "",
        display: selectedComponent.props?.style?.display,
        tooltipColor: selectedComponent.props?.tooltipColor,
        tooltipPosition: selectedComponent.props?.tooltipPosition,
        skeletonMinWidth: selectedComponent.props?.skeletonMinWidth,
        skeletonMinHeight: selectedComponent.props?.skeletonMinHeight,
        customAttributes: selectedComponent.props?.customAttributes ?? [],
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const addNewCustomProp = () => {
    form.insertListItem("customAttributes", {
      label: "",
      value: "",
    });
  };

  const customAttributes = form.values.customAttributes as SelectItem[];

  const updateCustomAttributes = () => {
    debouncedTreeComponentAttrsUpdate({
      attrs: { props: { customAttributes } },
    });
  };

  const deleteCustomAttr = (index: number) => {
    form.removeListItem("customAttributes", index);
    debouncedTreeComponentAttrsUpdate({
      attrs: {
        props: {
          customAttributes: customAttributes.filter((_, i) => i !== index),
        },
      },
    });
  };

  return (
    <form key={selectedComponent?.id}>
      <Stack spacing="xs">
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: { cursor: value } } },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: { overflow: value } } },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: { opacity: value } } },
            });
          }}
        />

        <ThemeColorSelector
          label="Tooltip Color"
          {...form.getInputProps("tooltipColor")}
          onChange={(value: string) => {
            form.setFieldValue("tooltipColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { tooltipColor: value } },
            });
          }}
        />
        <Select
          label="Tooltip Position"
          data={[
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
            { label: "Top", value: "top" },
            { label: "Bottom-End", value: "bottom-end" },
            { label: "Bottom-Start", value: "bottom-start" },
            { label: "Left-End", value: "left-end" },
            { label: "Left-Start", value: "left-start" },
            { label: "Right-End", value: "right-end" },
            { label: "Right-Start", value: "right-start" },
            { label: "Top-End", value: "top-end" },
            { label: "Top-Start", value: "top-start" },
          ]}
          {...form.getInputProps("tooltipPosition")}
          onChange={(value) => {
            form.setFieldValue("tooltipPosition", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { tooltipPosition: value } },
            });
          }}
        />
        <Stack spacing={2}>
          <TopLabel text="Skeleton" />
          <Group noWrap>
            {["skeletonMinWidth", "skeletonMinHeight"].map((key) => (
              <UnitInput
                key={key}
                label={key.endsWith("Width") ? "Width" : "Height"}
                size="xs"
                options={[
                  { value: "px", label: "px" },
                  { value: "%", label: "%" },
                ]}
                {...form.getInputProps(key)}
                onChange={(value) => {
                  form.setFieldValue(key, value);
                  debouncedTreeComponentAttrsUpdate({
                    attrs: { props: { [key]: value } },
                  });
                }}
              />
            ))}
          </Group>
        </Stack>
        <Stack mt={10} spacing="xs">
          <Flex align="center" justify="space-between">
            <TopLabel text="Custom Props" />
            <Button
              type="button"
              compact
              onClick={addNewCustomProp}
              variant="default"
              sx={{ marginRight: 0 }}
              leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
            >
              Add
            </Button>
          </Flex>
          <Stack spacing="xs">
            {customAttributes?.map(({ label, value }, index) => (
              <Group key={index} spacing={8} noWrap>
                <TextInput
                  size="xs"
                  placeholder="label"
                  value={label}
                  onChange={(e) =>
                    form.setFieldValue(
                      `customAttributes.${index}.label`,
                      e.target.value,
                    )
                  }
                  onBlur={updateCustomAttributes}
                  {...AUTOCOMPLETE_OFF_PROPS}
                />
                <TextInput
                  size="xs"
                  placeholder="value"
                  value={value}
                  onChange={(e) =>
                    form.setFieldValue(
                      `customAttributes.${index}.value`,
                      e.target.value,
                    )
                  }
                  onBlur={updateCustomAttributes}
                  {...AUTOCOMPLETE_OFF_PROPS}
                />

                <Icon
                  name={ICON_DELETE}
                  onClick={() => deleteCustomAttr(index)}
                  style={{ cursor: "pointer" }}
                />
              </Group>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
});

export default Modifier;
