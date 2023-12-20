import { SizeSelector } from "@/components/SizeSelector";
import { TopLabel } from "@/components/TopLabel";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowNarrowDown,
  IconArrowNarrowRight,
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutColumns,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const initialValues = requiredModifiers.gridColumn;

export const label = "Grid Column";
export const icon = IconLayoutColumns;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, initialValues, {
          alignSelf: selectedComponent.props?.style?.alignSelf,
          justifyContent: selectedComponent.props?.style?.justifyContent,
          gridAutoFlow: selectedComponent.props?.style?.gridAutoFlow,
          gap: selectedComponent.props?.style?.gap,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <SizeSelector
            label="Gap"
            {...form.getInputProps("gap")}
            onChange={(value) => {
              form.setFieldValue("gap", value);
              debouncedTreeUpdate(selectedComponentIds, {
                style: {
                  gap: value,
                },
              });
            }}
          />
          <Stack spacing={2}>
            <TopLabel text="Direction" />
            <SegmentedControl
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
                form.setFieldValue(" gridAutoFlow", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: {
                    gridAutoFlow: value,
                    // gridTemplateColumns:
                    //   value === "column" ? "inherit" : "auto",
                  },
                });
              }}
            />
          </Stack>
          <Stack spacing={2}>
            <TopLabel text="Align Vertically" />
            <SegmentedControl
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
                debouncedTreeUpdate(selectedComponentIds, {
                  style: {
                    alignSelf: value,
                  },
                });
              }}
            />
          </Stack>
          <Stack spacing={2}>
            <TopLabel text="Align Horizontally" />
            <SegmentedControl
              size="xs"
              data={[
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
                debouncedTreeUpdate(selectedComponentIds, {
                  style: {
                    justifyContent: value,
                  },
                });
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  },
);
