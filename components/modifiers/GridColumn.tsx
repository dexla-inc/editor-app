import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentStyleUpdate } from "@/utils/editor";
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
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { SizeSelector } from "../SizeSelector";
import { StylingPaneItemIcon } from "./StylingPaneItemIcon";

export const initialValues = requiredModifiers.gridColumn;

export const label = "Grid Column";
export const icon = IconLayoutColumns;

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({ initialValues });

  useEffect(() => {
    if (selectedComponent?.id) {
      const { alignSelf, gridAutoFlow, gap } = pick(
        selectedComponent.props!.style,
        ["alignSelf", "gridAutoFlow", "gap"],
      );
      form.setValues(
        merge({}, initialValues, { gap, alignSelf, gridAutoFlow }),
      );
    }
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
            debouncedTreeComponentStyleUpdate("gap", value);
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
              debouncedTreeComponentStyleUpdate(
                "gridAutoFlow",
                value as string,
              );
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
              debouncedTreeComponentStyleUpdate("alignSelf", value as string);
            }}
          />
        </Stack>
      </Stack>
    </form>
  );
});
