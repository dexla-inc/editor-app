import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { gapSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowNarrowDown,
  IconArrowNarrowRight,
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutColumns,
  IconLayoutDistributeHorizontal,
  IconRotate2,
  IconTextWrap,
  IconX,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlSizes } from "../SegmentedControlSizes";

export const label = "Grid Column";
export const icon = IconLayoutColumns;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.gridColumn, {
          alignSelf: selectedComponent.props?.style?.alignSelf,
          justifyContent: selectedComponent.props?.style?.justifyContent,
          gridAutoFlow: selectedComponent.props?.style?.gridAutoFlow,
          gap: selectedComponent.props?.gap,
          flexWrap: selectedComponent.props?.style?.flexWrap,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <SegmentedControlSizes
            label="Gap"
            sizing={gapSizes}
            includeZero
            {...form.getInputProps("gap")}
            onChange={(value) => {
              form.setFieldValue("gap", value);
              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    gap: value,
                  },
                },
              });
            }}
          />
          <SegmentedControlInput
            label="Direction"
            size="xs"
            data={[
              {
                label: (
                  <StylingPaneItemIcon
                    label="Vertical"
                    icon={<IconArrowNarrowDown size={14} />}
                  />
                ),
                value: "row",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Horizontal"
                    icon={<IconArrowNarrowRight size={14} />}
                  />
                ),
                value: "column",
              },
            ]}
            {...form.getInputProps("gridAutoFlow")}
            onChange={(value) => {
              form.setFieldValue("gridAutoFlow", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    style: {
                      gridAutoFlow: value,
                      gridAutoRows: value === "row" ? "max-content" : "auto", // This is to stop the grid column stretching
                      justifyContent: value === "row" ? "stretch" : "start",
                    },
                  },
                },
              });
            }}
          />
          {form.values.gridAutoFlow === "column" && (
            <SegmentedControlInput
              label="Wrap"
              size="xs"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="No Wrap"
                      icon={<IconX size={14} />}
                    />
                  ),
                  value: "nowrap",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Wrap"
                      icon={<IconTextWrap size={14} />}
                    />
                  ),
                  value: "wrap",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Reverse Wrap"
                      icon={<IconRotate2 size={14} />}
                    />
                  ),
                  value: "wrap-reverse",
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
              {...form.getInputProps("flexWrap")}
              onChange={(value) => {
                form.setFieldValue("flexWrap", value as string);
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      style: { flexWrap: value },
                    },
                  },
                });
              }}
            />
          )}
          <SegmentedControlInput
            label="Align Vertically"
            size="xs"
            data={[
              {
                label: (
                  <StylingPaneItemIcon
                    label="Top"
                    icon={<IconLayoutAlignLeft size={14} />}
                  />
                ),
                value: "start",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Middle"
                    icon={<IconLayoutAlignCenter size={14} />}
                  />
                ),
                value: "center",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Bottom"
                    icon={<IconLayoutAlignRight size={14} />}
                  />
                ),
                value: "end",
              },
            ]}
            {...form.getInputProps("alignSelf")}
            onChange={(value) => {
              form.setFieldValue("alignSelf", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    style: {
                      alignSelf: value,
                    },
                  },
                },
              });
            }}
          />
          <SegmentedControlInput
            label="Align Horizontally"
            size="xs"
            data={[
              {
                label: (
                  <StylingPaneItemIcon
                    label="Default"
                    icon={<IconLayoutDistributeHorizontal size={14} />}
                  />
                ),
                value: "stretch",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Left"
                    icon={<IconLayoutAlignLeft size={14} />}
                  />
                ),
                value: "start",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Middle"
                    icon={<IconLayoutAlignCenter size={14} />}
                  />
                ),
                value: "center",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Right"
                    icon={<IconLayoutAlignRight size={14} />}
                  />
                ),
                value: "end",
              },
            ]}
            {...form.getInputProps("justifyContent")}
            onChange={(value) => {
              form.setFieldValue("justifyContent", value as string);
              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    style: {
                      justifyContent: value,
                    },
                  },
                },
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
