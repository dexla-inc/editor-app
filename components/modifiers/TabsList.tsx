import { TopLabel } from "@/components/TopLabel";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutDistributeHorizontal,
  IconLayoutKanban,
} from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconLayoutKanban;
export const label = "Tabs List";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, requiredModifiers.tabsList, {
        position: selectedComponent.props?.position,
      }),
    });

    return (
      <form>
        <Stack spacing={2}>
          <TopLabel text="Position" />
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
                value: "left",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Center"
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
                value: "right",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Apart"
                    icon={<IconLayoutDistributeHorizontal size={14} />}
                  />
                ),
                value: "apart",
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
            {...form.getInputProps("position")}
            onChange={(value) => {
              form.setFieldValue("position", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                position: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
