import { SizeSelector } from "@/components/SizeSelector";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, Text } from "@mantine/core";
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

export const initialValues = requiredModifiers.gridColumn;

export const label = "Grid Column";
export const icon = IconLayoutColumns;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, initialValues, {
        alignSelf: selectedComponent.props?.style?.alignSelf,
        gridAutoFlow: selectedComponent.props?.style?.gridAutoFlow,
        gap: selectedComponent.props?.style?.gap,
      }),
    });

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
            <Text size="xs" fw={500}>
              Direction
            </Text>
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
                  },
                });
              }}
            />
          </Stack>
          <Stack spacing={2}>
            <Text size="xs" fw={500}>
              Align Vertically
            </Text>
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
        </Stack>
      </form>
    );
  },
);
