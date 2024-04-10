import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Checkbox, SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

export const defaultPopOverValues = requiredModifiers.popOver;

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
  useEffect(() => {
    form.setValues(
      merge({}, defaultPopOverValues, {
        position: selectedComponent?.props?.position,
        showInEditor: selectedComponent.props?.showInEditor,
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
              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    position: value,
                  },
                },
              });
            }}
          />

          <Checkbox
            size="xs"
            label="Force Hide"
            {...form.getInputProps("showInEditor", { type: "checkbox" })}
            onChange={(e) => {
              form.setFieldValue("showInEditor", e.target.checked);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { showInEditor: e.target.checked } },
              });
            }}
          />
        </Stack>
      </Stack>
    </form>
  );
});

export default Modifier;
