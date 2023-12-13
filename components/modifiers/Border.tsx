import {
  CardStyleProps,
  CardStyleSelector,
  getCardStyling,
} from "@/components/CardStyleSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { CardStyle } from "@/requests/projects/types";
import { useEditorStore } from "@/stores/editor";
import { INPUT_SIZE } from "@/utils/config";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, SegmentedControl, Stack } from "@mantine/core";
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
import merge from "lodash.merge";
import startCase from "lodash.startcase";

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
  }, "Border.6");
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const { theme, setTheme } = useEditorStore((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
    }));
    const style = selectedComponent?.props?.style;

    const isBorderRadiusAllSame =
      style?.borderTopLeftRadius === style?.borderTopRightRadius &&
      style?.borderTopLeftRadius === style?.borderBottomLeftRadius &&
      style?.borderTopLeftRadius === style?.borderBottomRightRadius;

    const form = useForm<Record<string, any>>({
      initialValues: merge(
        {},
        {
          showBorder: "all",
          showRadius: isBorderRadiusAllSame ? "radius-all" : "radius-sides",
          ...defaultBorderValues,
        },
        {
          borderStyle: selectedComponent.props?.style?.borderStyle,
          borderTopStyle: selectedComponent.props?.style?.borderTopStyle,
          borderRightStyle: selectedComponent.props?.style?.borderRightStyle,
          borderBottomStyle: selectedComponent.props?.style?.borderBottomStyle,
          borderLeftStyle: selectedComponent.props?.style?.borderLeftStyle,
          borderColor: getThemeColor(
            theme,
            selectedComponent.props?.style?.borderColor,
          ),
          borderTopColor: getThemeColor(
            theme,
            selectedComponent.props?.style?.borderTopColor,
          ),
          borderRightColor: getThemeColor(
            theme,
            selectedComponent.props?.style?.borderRightColor,
          ),
          borderBottomColor: getThemeColor(
            theme,
            selectedComponent.props?.style?.borderBottomColor,
          ),
          borderLeftColor: getThemeColor(
            theme,
            selectedComponent.props?.style?.borderLeftColor,
          ),
          borderRadius: selectedComponent.props?.style?.borderRadius,
          borderTopLeftRadius:
            selectedComponent.props?.style?.borderTopLeftRadius,
          borderTopRightRadius:
            selectedComponent.props?.style?.borderTopRightRadius,
          borderBottomLeftRadius:
            selectedComponent.props?.style?.borderBottomLeftRadius,
          borderBottomRightRadius:
            selectedComponent.props?.style?.borderBottomRightRadius,
          borderWidth: selectedComponent.props?.style?.borderWidth,
          borderTopWidth: selectedComponent.props?.style?.borderTopWidth,
          borderRightWidth: selectedComponent.props?.style?.borderRightWidth,
          borderBottomWidth: selectedComponent.props?.style?.borderBottomWidth,
          borderLeftWidth: selectedComponent.props?.style?.borderLeftWidth,
        },
      ),
    });

    const changeBorderColor = (_value: string) => {
      const [color, index] = _value.split(".");
      const value = index ? theme.colors[color][Number(index)] : color;
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

      debouncedTreeUpdate(selectedComponentIds, {
        style: borderColor,
      });
    };

    const changeBorderStyle = (value: string) => {
      let borderStyle = {};
      const key =
        form.values.showBorder === "all"
          ? "borderColor"
          : `border${startCase(form.values.showBorder)}Color`;
      let borderColor = {};
      const [color, index] = form.values[key].split(".");
      const borderValue = index ? theme.colors[color][index] : color;
      borderColor = {
        [key]: borderValue,
        ...(key === "borderColor" ? {} : { borderColor: borderValue }),
      };
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

        // @ts-ignore
      } else {
        const key = `border${startCase(form.values.showBorder)}Style`;
        form.setFieldValue("borderStyle", value);
        form.setFieldValue(key, value);
        borderStyle = {
          [key]: value,
        };
      }
      debouncedTreeUpdate(selectedComponentIds, {
        style: { ...borderStyle, ...borderColor },
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
        {selectedComponent?.name === "Card" ? (
          <CardStyleSelector
            value={theme.cardStyle}
            onChange={(value) => {
              const cardStyles = getCardStyling(
                value as CardStyle,
                theme.colors["Border"][6],
                theme.defaultRadius,
              );

              setTheme({
                ...theme,
                cardStyle: value as CardStyle,
              });

              Object.keys(cardStyles).forEach((key) => {
                const styleKey = key as keyof CardStyleProps;
                form.setFieldValue(styleKey, cardStyles[styleKey]);
              });

              debouncedTreeUpdate(selectedComponentIds, {
                style: cardStyles,
              });
            }}
            size={INPUT_SIZE}
          />
        ) : (
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
              <TopLabel text="Style" />
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

                debouncedTreeUpdate(selectedComponentIds, {
                  style: borderWidth,
                });
              }}
            />
            <ThemeColorSelector
              label="Color"
              {...form.getInputProps(getBorderProp("Color"))}
              onChange={(_value: string) => changeBorderColor(_value)}
            />
            <Stack spacing={4} mt={12}>
              <TopLabel text="Radius" />
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

                      debouncedTreeUpdate(selectedComponentIds, {
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
                        form.setFieldValue(
                          "borderTopLeftRadius",
                          value as string,
                        );
                        debouncedTreeUpdate(selectedComponentIds, {
                          style: { borderTopLeftRadius: value },
                        });
                      }}
                    />
                    <UnitInput
                      label="Top Right"
                      {...form.getInputProps("borderTopRightRadius")}
                      onChange={(value) => {
                        form.setFieldValue(
                          "borderTopRightRadius",
                          value as string,
                        );
                        debouncedTreeUpdate(selectedComponentIds, {
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
                        debouncedTreeUpdate(selectedComponentIds, {
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
                        debouncedTreeUpdate(selectedComponentIds, {
                          style: { borderBottomRightRadius: value },
                        });
                      }}
                    />
                  </Group>
                </>
              )}
            </Stack>
          </Stack>
        )}
      </form>
    );
  },
);
