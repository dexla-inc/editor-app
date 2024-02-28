import { FontSelector } from "@/components/FontSelector";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { getThemeColor } from "@/components/modifiers/Border";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { ActionIcon, Flex, SegmentedControl, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconCheck,
  IconLetterCase,
  IconLetterCaseLower,
  IconLetterCaseUpper,
  IconLetterN,
  IconMinus,
  IconOverline,
  IconPlus,
  IconStrikethrough,
  IconTextSize,
  IconUnderline,
  IconX,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";

export const icon = IconTextSize;
export const label = "Content";

const defaultTextValues = requiredModifiers.text;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const theme = useEditorStore((state) => state.theme);

    const shadow = selectedComponent?.props?.style?.textShadow ?? "";
    const getShadowStyle = (shadow: string) => {
      const values = shadow.split(/\s+/);

      const xOffset = values[0];
      const yOffset = values[1];
      const blur = values[2];
      const shadowColor = values.slice(3).join(" ");

      return { xOffset, yOffset, blur, shadowColor };
    };
    const isTitle = selectedComponent?.name === "Title";

    const [addShadow, { open: add, close: remove }] = useDisclosure(false);
    const { xOffset, yOffset, blur, shadowColor } = getShadowStyle(shadow);

    const data = pick(selectedComponent.props!, [
      "align",
      "style",
      "color",
      "fontTag",
      "tt",
      "td",
      "truncate",
      "order",
    ]);

    const form = useForm({
      initialValues: merge({}, defaultTextValues, {
        ...(!isTitle && { fontTag: data.fontTag ?? defaultTextValues.fontTag }),
        order: data.order?.toString() ?? defaultTextValues.order,
        color: data.color ?? defaultTextValues.color,
        align: data.align ?? defaultTextValues.align,
        whiteSpace:
          data.style?.whiteSpace ?? defaultTextValues.style.whiteSpace,
        textTransform: data.tt ?? defaultTextValues.tt,
        textDecoration: data.td ?? defaultTextValues.td,
        truncate: data.truncate?.toString() ?? defaultTextValues.truncate,
        xOffset: xOffset ?? "0px",
        yOffset: yOffset ?? "0px",
        blur: blur ?? "0px",
        shadowColor: getThemeColor(theme, shadowColor),
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          {!isTitle && (
            <FontSelector
              {...form.getInputProps("fontTag")}
              form={form as any}
              selectedComponentIds={selectedComponentIds}
            />
          )}
          {isTitle && (
            <SegmentedControlInput
              label="Tag"
              data={[
                { label: "H1", value: "1" },
                { label: "H2", value: "2" },
                { label: "H3", value: "3" },
                { label: "H4", value: "4" },
                { label: "H5", value: "5" },
                { label: "H6", value: "6" },
              ]}
              {...form.getInputProps("order")}
              onChange={(value) => {
                // @ts-ignore
                const size = theme.headings.sizes[`h${value}`];
                form.setFieldValue("order", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  order: parseInt(value as string, 10),
                  style: {
                    fontSize: size.fontSize,
                    lineHeight: size.lineHeight,
                    fontWeight: size.fontWeight,
                  },
                });
              }}
            />
          )}
          <Stack w="100%" spacing={2}>
            <TopLabel text="Text Wrap" />
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Off"
                      icon={<IconX size={14} />}
                    />
                  ),
                  value: "nowrap",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="On"
                      icon={<IconCheck size={14} />}
                    />
                  ),
                  value: "normal",
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
              {...form.getInputProps("whiteSpace")}
              onChange={(value) => {
                form.setFieldValue("whiteSpace", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { whiteSpace: value },
                  truncate: value === "normal" ? false : true,
                });
              }}
            />
          </Stack>
          <Stack spacing={2}>
            <TopLabel text="Alignment" />
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Left"
                      icon={<IconAlignLeft size={14} />}
                    />
                  ),
                  value: "left",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Center"
                      icon={<IconAlignCenter size={14} />}
                    />
                  ),
                  value: "center",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Right"
                      icon={<IconAlignRight size={14} />}
                    />
                  ),
                  value: "right",
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
              {...form.getInputProps("align")}
              onChange={(value) => {
                form.setFieldValue("align", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { textAlign: value as string },
                });
              }}
            />
          </Stack>

          <Stack spacing={2}>
            <TopLabel text="Text Transform" />
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="None"
                      icon={<IconLetterN size={14} />}
                    />
                  ),
                  value: "none",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Lowercase"
                      icon={<IconLetterCaseLower size={14} />}
                    />
                  ),
                  value: "lowercase",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Uppercase"
                      icon={<IconLetterCaseUpper size={14} />}
                    />
                  ),
                  value: "uppercase",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Capitalize"
                      icon={<IconLetterCase size={14} />}
                    />
                  ),
                  value: "capitalize",
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
              {...form.getInputProps("textTransform")}
              onChange={(value) => {
                form.setFieldValue("textTransform", value as string);
                debouncedTreeUpdate(selectedComponentIds, { tt: value });
              }}
            />
          </Stack>

          <Stack spacing={2}>
            <TopLabel text="Decoration" />
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
                      label="Underline"
                      icon={<IconUnderline size={14} />}
                    />
                  ),
                  value: "underline",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Overline"
                      icon={<IconOverline size={14} />}
                    />
                  ),
                  value: "overline",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Strikethrough"
                      icon={<IconStrikethrough size={14} />}
                    />
                  ),
                  value: "line-through",
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
              {...form.getInputProps("textDecoration")}
              onChange={(value) => {
                form.setFieldValue("textDecoration", value as string);
                debouncedTreeUpdate(selectedComponentIds, { td: value });
              }}
            />
          </Stack>
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponentIds, { color: value });
            }}
          />

          <Stack spacing={8}>
            <Flex justify="space-between" align="center">
              <Text size="xs" fw={500}>
                Text Shadow
              </Text>
              <ActionIcon
                variant="subtle"
                onClick={() => (addShadow ? remove() : add())}
              >
                {addShadow ? (
                  <IconMinus size={ICON_SIZE} />
                ) : (
                  <IconPlus size={ICON_SIZE} />
                )}
              </ActionIcon>
            </Flex>

            {addShadow && (
              <>
                <Flex gap="xs">
                  <UnitInput
                    label="X Offset"
                    {...form.getInputProps("xOffset")}
                    onChange={(value) => {
                      form.setFieldValue("xOffset", value as string);
                      const textShadow = `${value} ${yOffset} ${blur} ${shadowColor}`;

                      debouncedTreeUpdate(selectedComponentIds, {
                        style: { textShadow },
                      });
                    }}
                    options={[
                      { value: "px", label: "PX" },
                      { value: "%", label: "%" },
                    ]}
                  />
                  <UnitInput
                    label="Y Offset"
                    {...form.getInputProps("yOffset")}
                    onChange={(value) => {
                      form.setFieldValue("yOffset", value as string);
                      const textShadow = `${xOffset} ${value} ${blur} ${shadowColor}`;

                      debouncedTreeUpdate(selectedComponentIds, {
                        style: { textShadow },
                      });
                    }}
                    options={[
                      { value: "px", label: "PX" },
                      { value: "%", label: "%" },
                    ]}
                  />
                </Flex>
                <UnitInput
                  w="50%"
                  label="Blur"
                  {...form.getInputProps("blur")}
                  onChange={(value) => {
                    form.setFieldValue("blur", value as string);
                    const textShadow = `${xOffset} ${yOffset} ${value} ${shadowColor}`;

                    debouncedTreeUpdate(selectedComponentIds, {
                      style: { textShadow },
                    });
                  }}
                  options={[
                    { value: "px", label: "PX" },
                    { value: "%", label: "%" },
                  ]}
                />
                <ThemeColorSelector
                  label="Shadow Color"
                  {...form.getInputProps("shadowColor")}
                  onChange={(_value: string) => {
                    const [color, index] = _value.split(".");
                    // @ts-ignore
                    const value = theme.colors[color][index];

                    form.setFieldValue("shadowColor", _value);
                    const textShadow = `${xOffset} ${yOffset} ${blur} ${value}`;

                    debouncedTreeUpdate(selectedComponentIds, {
                      style: { textShadow },
                    });
                  }}
                />
              </>
            )}
          </Stack>
        </Stack>
      </form>
    );
  },
);
