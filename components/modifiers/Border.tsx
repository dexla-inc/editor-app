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
import { useThemeStore } from "@/stores/theme";
import { allEqual } from "@/utils/common";
import { INPUT_SIZE } from "@/utils/config";
import { radiusSizes } from "@/utils/defaultSizes";
import {
  debouncedTreeComponentAttrsUpdate,
  getThemeColor,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBorderBottom,
  IconBorderCorners,
  IconBorderLeft,
  IconBorderRight,
  IconBorderTop,
  IconLineDashed,
  IconLineDotted,
  IconMinus,
  IconSquare,
  IconX,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import startCase from "lodash.startcase";
import { useEffect } from "react";

export const defaultBorderValues = requiredModifiers.border;

const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useThemeStore((state) => state.theme);
  const isCardComponent = selectedComponent?.name === "Card";

  const style = selectedComponent?.props?.style;

  const isBorderRadiusAllSame = allEqual<string[]>([
    style?.borderTopLeftRadius,
    style?.borderTopRightRadius,
    style?.borderBottomLeftRadius,
    style?.borderBottomRightRadius,
  ]);

  const form = useForm();
  useEffect(() => {
    form.setValues(
      merge(
        {},
        defaultBorderValues,
        {
          showRadius: isBorderRadiusAllSame ? "radius-all" : "radius-sides",
        },
        {
          showBorder: selectedComponent?.props?.showBorder ?? "all",
          borderStyle: style?.borderStyle,
          borderTopStyle: style?.borderTopStyle,
          borderRightStyle: style?.borderRightStyle,
          borderBottomStyle: style?.borderBottomStyle,
          borderLeftStyle: style?.borderLeftStyle,
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
          borderRadius: style?.borderRadius ?? radiusSizes[theme.defaultRadius],
          borderTopLeftRadius: style?.borderTopLeftRadius,
          borderTopRightRadius: style?.borderTopRightRadius,
          borderBottomLeftRadius: style?.borderBottomLeftRadius,
          borderBottomRightRadius: style?.borderBottomRightRadius,
          borderWidth: style?.borderWidth,
          borderTopWidth: style?.borderTopWidth,
          borderRightWidth: style?.borderRightWidth,
          borderBottomWidth: style?.borderBottomWidth,
          borderLeftWidth: style?.borderLeftWidth,
          ...(isCardComponent && {
            cardStyle: selectedComponent?.props?.cardStyle ?? "ROUNDED",
          }),
        },
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const changeBorderColor = (_value: string) => {
    const [color, index] = _value.split(".");
    const value = index ? theme.colors[color][Number(index)] : color;
    let borderColor = {};
    let borderColorForForm = {};
    if (form.values.showBorder === "all") {
      borderColor = {
        borderColor: value,
        borderTopColor: value,
        borderRightColor: value,
        borderBottomColor: value,
        borderLeftColor: value,
      };
      borderColorForForm = {
        borderColor: _value,
        borderTopColor: _value,
        borderRightColor: _value,
        borderBottomColor: _value,
        borderLeftColor: _value,
      };
    } else {
      const key = `border${startCase(form.values.showBorder as string)}Color`;
      form.setFieldValue("borderColor", _value);
      borderColor = {
        [key]: value,
      };
      borderColorForForm = {
        [key]: _value,
      };
    }
    form.setValues(borderColorForForm);

    debouncedTreeComponentAttrsUpdate({
      attrs: { props: { style: borderColor } },
    });
  };

  const changeBorderStyle = (value: string) => {
    let borderStyle = {};
    const key =
      form.values.showBorder === "all"
        ? "borderColor"
        : `border${startCase(form.values.showBorder as string)}Color`;
    let borderColor = {};
    const [color, index] = form.getInputProps(key).value.split(".");
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
    } else {
      const key = `border${startCase(form.values.showBorder as string)}Style`;
      form.setFieldValue("borderStyle", value);
      borderStyle = {
        [key]: value,
      };
    }

    form.setValues(borderStyle);
    debouncedTreeComponentAttrsUpdate({
      attrs: {
        props: {
          showBorder: form.values.showBorder,
          style: { ...borderStyle, ...borderColor },
        },
      },
    });
  };

  const getBorderProp = (val: string) => {
    if (form.values.showBorder === "all") {
      return `border${startCase(val)}`;
    }
    return `border${startCase(form.values.showBorder as string)}${val}`;
  };

  return (
    <form key={selectedComponent?.id}>
      {isCardComponent ? (
        <CardStyleSelector
          value={(form.values.cardStyle ?? theme.cardStyle) as CardStyle}
          onChange={(value) => {
            const cardStyles = getCardStyling(
              value as CardStyle,
              theme.colors["Border"][6],
              theme.defaultRadius,
            );

            Object.keys(cardStyles).forEach((key) => {
              const styleKey = key as keyof CardStyleProps;
              form.setFieldValue(styleKey, cardStyles[styleKey]);
            });

            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  style: cardStyles,
                  cardStyle: value as CardStyle,
                },
              },
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
            onChange={(value) => {
              form.setFieldValue("showBorder", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    showBorder: value,
                  },
                },
              });
            }}
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
          {form.values?.[getBorderProp("Style")] !== "none" && (
            <>
              {/* Start: Hide if border style is none */}
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
                    form.setValues({ ...borderWidth });
                  } else {
                    const key = `border${startCase(
                      form.values.showBorder as string,
                    )}Width`;
                    form.setFieldValue("borderWidth", value);
                    form.setFieldValue(key, value);
                    borderWidth = {
                      [key]: value,
                    };
                  }

                  debouncedTreeComponentAttrsUpdate({
                    attrs: {
                      props: {
                        style: borderWidth,
                      },
                    },
                  });
                }}
              />
              <ThemeColorSelector
                label="Color"
                {...form.getInputProps(getBorderProp("Color"))}
                onChange={(_value: string) => changeBorderColor(_value)}
              />
              {/* End: Hide if border style is none */}
            </>
          )}
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
                    const borderRadius = {
                      borderRadius: value,
                      borderTopLeftRadius: value,
                      borderTopRightRadius: value,
                      borderBottomLeftRadius: value,
                      borderBottomRightRadius: value,
                    };
                    form.setValues({ ...borderRadius });
                    debouncedTreeComponentAttrsUpdate({
                      attrs: {
                        props: {
                          style: borderRadius,
                        },
                      },
                    });
                  }}
                  options={[
                    { value: "px", label: "PX" },
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
                      debouncedTreeComponentAttrsUpdate({
                        attrs: {
                          props: {
                            style: { borderTopLeftRadius: value },
                          },
                        },
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
                      debouncedTreeComponentAttrsUpdate({
                        attrs: {
                          props: {
                            style: { borderTopRightRadius: value },
                          },
                        },
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
                      debouncedTreeComponentAttrsUpdate({
                        attrs: {
                          props: {
                            style: { borderBottomLeftRadius: value },
                          },
                        },
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
                      debouncedTreeComponentAttrsUpdate({
                        attrs: {
                          props: {
                            style: { borderBottomRightRadius: value },
                          },
                        },
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
});

export default Modifier;
