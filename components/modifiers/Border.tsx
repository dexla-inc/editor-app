import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { UnitInput } from "@/components/UnitInput";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBorderBottom,
  IconBorderCorners,
  IconBorderLeft,
  IconBorderRight,
  IconBorderStyle,
  IconBorderTop,
  IconLineDashed,
  IconLineDotted,
  IconMinus,
  IconSquare,
  IconX,
} from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconBorderStyle;
export const label = "Border";

export const defaultBorderValues = requiredModifiers.border;

export const getThemeColor = (theme: any, hex: string) => {
  if (hex === "transparent") return hex;
  return Object.keys(theme.colors).reduce((themeColor: string, key: string) => {
    const colorIndex = theme.colors[key].findIndex((c: string) => c === hex);

    if (colorIndex > -1) {
      themeColor = `${key}.${colorIndex}`;
    }

    return themeColor;
  }, "Black.9");
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useEditorStore((state) => state.theme);
  const style = selectedComponent?.props?.style;

  const isBorderRadiusAllSame =
    style?.borderTopLeftRadius === style?.borderTopRightRadius &&
    style?.borderTopLeftRadius === style?.borderBottomLeftRadius &&
    style?.borderTopLeftRadius === style?.borderBottomRightRadius;

  const form = useForm<Record<string, any>>({
    initialValues: {
      showBorder: "all",
      showRadius: isBorderRadiusAllSame ? "radius-all" : "radius-sides",
      ...defaultBorderValues,
    },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const { style } = pick(selectedComponent.props!, ["style"]);

      form.setValues({
        // @ts-ignore
        borderStyle: style?.borderStyle ?? defaultBorderValues.borderStyle,
        borderTopStyle:
          style?.borderTopStyle ?? defaultBorderValues.borderTopStyle,
        borderRightStyle:
          style?.borderRightStyle ?? defaultBorderValues.borderRightStyle,
        borderBottomStyle:
          style?.borderBottomStyle ?? defaultBorderValues.borderBottomStyle,
        borderLeftStyle:
          style?.borderLeftStyle ?? defaultBorderValues.borderLeftStyle,
        borderColor: style?.borderColor
          ? getThemeColor(theme, style.borderColor)
          : defaultBorderValues.borderTopColor,
        borderTopColor: style?.borderTopColor
          ? getThemeColor(theme, style.borderTopColor)
          : defaultBorderValues.borderTopColor,
        borderRightColor: style?.borderRightColor
          ? getThemeColor(theme, style.borderRightColor)
          : defaultBorderValues.borderRightColor,
        borderBottomColor: style?.borderBottomColor
          ? getThemeColor(theme, style.borderBottomColor)
          : defaultBorderValues.borderBottomColor,
        borderLeftColor: style?.borderLeftColor
          ? getThemeColor(theme, style.borderLeftColor)
          : defaultBorderValues.borderLeftColor,
        borderRadius: style?.borderRadius ?? defaultBorderValues.borderRadius,
        borderTopLeftRadius:
          style?.borderTopLeftRadius ?? defaultBorderValues.borderTopLeftRadius,
        borderTopRightRadius:
          style?.borderTopRightRadius ??
          defaultBorderValues.borderTopRightRadius,
        borderBottomLeftRadius:
          style?.borderBottomLeftRadius ??
          defaultBorderValues.borderBottomLeftRadius,
        borderBottomRightRadius:
          style?.borderBottomRightRadius ??
          defaultBorderValues.borderBottomRightRadius,
        borderWidth: style?.borderWidth ?? defaultBorderValues.borderWidth,
        borderTopWidth:
          style?.borderTopWidth ?? defaultBorderValues.borderTopWidth,
        borderRightWidth:
          style?.borderRightWidth ?? defaultBorderValues.borderRightWidth,
        borderBottomWidth:
          style?.borderBottomWidth ?? defaultBorderValues.borderBottomWidth,
        borderLeftWidth:
          style?.borderLeftWidth ?? defaultBorderValues.borderLeftWidth,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const changeBorderStyle = (value: string) => {
    let borderStyle = {};
    if (form.values.showBorder === "all") {
      borderStyle = {
        borderStyle: value,
        borderTopStyle: value,
        borderRightStyle: value,
        borderBottomStyle: value,
        borderLeftStyle: value,
      };
      form.setFieldValue("borderStyle", value);
      form.setFieldValue("borderTopStyle", value);
      form.setFieldValue("borderRightStyle", value);
      form.setFieldValue("borderBottomStyle", value);
      form.setFieldValue("borderLeftStyle", value);
    } else {
      const key = `border${startCase(form.values.showBorder)}Style`;
      form.setFieldValue("borderStyle", value);
      form.setFieldValue(key, value);
      borderStyle = {
        [key]: value,
      };
    }
    debouncedTreeUpdate(selectedComponent?.id as string, {
      style: borderStyle,
    });
  };

  const getBorderProp = (val: string) => {
    if (form.values.showBorder === "all") {
      return `border${startCase(val)}`;
    }
    return `border${startCase(form.values.showBorder)}${val}`;
  };

  return (
    <form key={selectedComponent?.id}>
      <Stack spacing="xs">
        <SegmentedControl
          size="xs"
          data={[
            {
              label: (
                <StylingPaneItemIcon
                  label="All"
                  icon={<IconSquare size={14} />}
                />
              ),
              value: "all",
            },
            {
              label: (
                <StylingPaneItemIcon
                  label="Left"
                  icon={<IconBorderLeft size={14} />}
                />
              ),
              value: "left",
            },
            {
              label: (
                <StylingPaneItemIcon
                  label="Top"
                  icon={<IconBorderTop size={14} />}
                />
              ),
              value: "top",
            },
            {
              label: (
                <StylingPaneItemIcon
                  label="Right"
                  icon={<IconBorderRight size={14} />}
                />
              ),
              value: "right",
            },
            {
              label: (
                <StylingPaneItemIcon
                  label="Bottom"
                  icon={<IconBorderBottom size={14} />}
                />
              ),
              value: "bottom",
            },
          ]}
          styles={{
            label: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            },
          }}
          {...form.getInputProps("showBorder")}
          onChange={(value) =>
            form.setFieldValue("showBorder", value as string)
          }
        />
        <Stack spacing={2}>
          <Text size="0.75rem">Style</Text>
          <SegmentedControl
            size="xs"
            data={[
              {
                label: (
                  <StylingPaneItemIcon
                    label="None"
                    icon={<IconX size={14} />}
                  />
                ),
                value: "none",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Solid"
                    icon={<IconMinus size={14} />}
                  />
                ),
                value: "solid",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Dashed"
                    icon={<IconLineDashed size={14} />}
                  />
                ),
                value: "dashed",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Dotted"
                    icon={<IconLineDotted size={14} />}
                  />
                ),
                value: "dotted",
              },
            ]}
            styles={{
              label: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              },
            }}
            {...form.getInputProps(getBorderProp("Style"))}
            onChange={(value) => changeBorderStyle(value)}
          />
        </Stack>
        <UnitInput
          label="Size"
          {...form.getInputProps(getBorderProp("Width"))}
          onChange={(value) => {
            let borderWidth = {};

            if (form.values.showBorder === "all") {
              borderWidth = {
                borderWidth: value,
                borderTopWidth: value,
                borderRightWidth: value,
                borderBottomWidth: value,
                borderLeftWidth: value,
              };
              form.setFieldValue("borderWidth", value);
              form.setFieldValue("borderTopWidth", value);
              form.setFieldValue("borderRightWidth", value);
              form.setFieldValue("borderBottomWidth", value);
              form.setFieldValue("borderLeftWidth", value);
            } else {
              const key = `border${startCase(form.values.showBorder)}Width`;
              form.setFieldValue("borderWidth", value);
              form.setFieldValue(key, value);
              borderWidth = {
                [key]: value,
              };
            }

            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: borderWidth,
            });
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps(getBorderProp("Color"))}
          onChange={(_value: string) => {
            const [color, index] = _value.split(".");
            // @ts-ignore
            const value = index ? theme.colors[color][index] : color;
            let borderColor = {};
            if (form.values.showBorder === "all") {
              borderColor = {
                borderColor: value,
                borderTopColor: value,
                borderRightColor: value,
                borderBottomColor: value,
                borderLeftColor: value,
              };
              form.setFieldValue("borderColor", _value);
              form.setFieldValue("borderTopColor", _value);
              form.setFieldValue("borderRightColor", _value);
              form.setFieldValue("borderBottomColor", _value);
              form.setFieldValue("borderLeftColor", _value);
            } else {
              const key = `border${startCase(form.values.showBorder)}Color`;
              form.setFieldValue("borderColor", _value);
              form.setFieldValue(key, _value);
              borderColor = {
                [key]: value,
              };
            }

            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: borderColor,
            });
          }}
        />
        <Stack spacing={4} mt={12}>
          <Text size="0.75rem" weight={500}>
            Radius
          </Text>
          <Group noWrap>
            <SegmentedControl
              fullWidth
              size="sm"
              w="100%"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="All"
                      icon={<IconSquare size={14} />}
                    />
                  ),
                  value: "radius-all",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Sides"
                      icon={<IconBorderCorners size={14} />}
                    />
                  ),
                  value: "radius-sides",
                },
              ]}
              styles={{
                label: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                },
              }}
              {...form.getInputProps("showRadius")}
            />
            {form.values.showRadius === "radius-all" && (
              <UnitInput
                {...form.getInputProps("borderRadius")}
                onChange={(value) => {
                  form.setFieldValue("borderRadius", value);
                  form.setFieldValue("borderTopLeftRadius", value);
                  form.setFieldValue("borderTopRightRadius", value);
                  form.setFieldValue("borderBottomLeftRadius", value);
                  form.setFieldValue("borderBottomRightRadius", value);

                  debouncedTreeUpdate(selectedComponent?.id as string, {
                    style: {
                      borderRadius: value,
                      borderTopLeftRadius: value,
                      borderTopRightRadius: value,
                      borderBottomLeftRadius: value,
                      borderBottomRightRadius: value,
                    },
                  });
                }}
                options={[
                  { value: "px", label: "PX" },
                  { value: "rem", label: "REM" },
                  { value: "%", label: "%" },
                ]}
              />
            )}
          </Group>
          {form.values.showRadius === "radius-sides" && (
            <>
              <Group noWrap>
                <UnitInput
                  label="Top Left"
                  {...form.getInputProps("borderTopLeftRadius")}
                  onChange={(value) => {
                    form.setFieldValue("borderTopLeftRadius", value as string);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { borderTopLeftRadius: value },
                    });
                  }}
                />
                <UnitInput
                  label="Top Right"
                  {...form.getInputProps("borderTopRightRadius")}
                  onChange={(value) => {
                    form.setFieldValue("borderTopRightRadius", value as string);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { borderTopRightRadius: value },
                    });
                  }}
                />
              </Group>
              <Group noWrap>
                <UnitInput
                  label="Bottom Left"
                  {...form.getInputProps("borderBottomLeftRadius")}
                  onChange={(value) => {
                    form.setFieldValue(
                      "borderBottomLeftRadius",
                      value as string,
                    );
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { borderBottomLeftRadius: value },
                    });
                  }}
                />
                <UnitInput
                  label="Bottom Right"
                  {...form.getInputProps("borderBottomRightRadius")}
                  onChange={(value) => {
                    form.setFieldValue(
                      "borderBottomRightRadius",
                      value as string,
                    );
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { borderBottomRightRadius: value },
                    });
                  }}
                />
              </Group>
            </>
          )}
        </Stack>
      </Stack>
    </form>
  );
});
