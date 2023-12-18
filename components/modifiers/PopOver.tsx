import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutSidebarLeftCollapse } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconLayoutSidebarLeftCollapse;
export const label = "PopOver";

export const defaultPopOverValues = requiredModifiers.popOver;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultPopOverValues, {
        position: selectedComponent?.props?.position,
      }),
    });

    useEffect(() => {
      form.setValues(
        merge({}, defaultPopOverValues, {
          position: selectedComponent?.props?.position,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <Stack spacing={2}>
            <TopLabel text="Position" />
            <SegmentedControl
              size="xs"
              data={[
                { label: "Left", value: "left" },
                { label: "Top", value: "top" },
                { label: "Right", value: "right" },
                { label: "Bottom", value: "bottom" },
              ]}
              {...form.getInputProps("position")}
              onChange={(value) => {
                form.setFieldValue("position", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  position: value,
                });
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  },
);
