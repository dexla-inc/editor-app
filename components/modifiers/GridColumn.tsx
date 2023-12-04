import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentStyleUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutColumns,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { StylingPaneItemIcon } from "./StylingPaneItemIcon";

const initialValues = requiredModifiers.gridColumn;

export const label = "Grid";
export const icon = IconLayoutColumns;

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({ initialValues });

  useEffect(() => {
    if (selectedComponent?.id) {
      const { alignSelf, gridAutoFlow } = pick(selectedComponent.props!.style, [
        "alignSelf",
        "gridAutoFlow",
      ]);
      form.setValues(merge({}, initialValues, { alignSelf, gridAutoFlow }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  // gridTemplateColumns: string; // e.g., 'repeat(3, 1fr)' or '200px 1fr 200px'
  // gridTemplateRows?: string; // e.g., 'repeat(2, 100px)' or 'auto'
  // gridColumnGap: string; // e.g., '10px'
  // gridRowGap: string; // e.g., '10px'
  // justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  // alignItems: 'start' | 'end' | 'center' | 'stretch';
  // padding: string;

  return (
    <form>
      <Stack spacing="xs">
        <Stack spacing={2}>
          <Text size="xs" fw={500}>
            Direction
          </Text>
          <SegmentedControl
            size="xs"
            data={[
              { label: "Horizontal", value: "row" },
              { label: "Vertical", value: "column" },
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
