import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutDistributeHorizontal,
  IconLayoutKanban,
} from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { StylingPaneItemIcon } from "./StylingPaneItemIcon";

export const icon = IconLayoutKanban;
export const label = "Tabs List";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: { ...requiredModifiers.tabsList },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["position"]);

      form.setValues({
        position: data.position ?? requiredModifiers.tabsList.position,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing={2}>
        <Text size="xs" fw={500}>
          Position
        </Text>
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
            debouncedTreeComponentPropsUpdate("position", value as string);
          }}
        />
      </Stack>
    </form>
  );
});
