import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Checkbox, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

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
          <Select
            size="xs"
            data={[
              { label: "Left", value: "left" },
              { label: "Top", value: "top" },
              { label: "Right", value: "right" },
              { label: "Bottom", value: "bottom" },
              { label: "Left End", value: "left-end" },
              { label: "Left Start", value: "left-start" },
              { label: "Top End", value: "top-end" },
              { label: "Top Start", value: "top-start" },
              { label: "Right End", value: "right-end" },
              { label: "Right Start", value: "right-start" },
              { label: "Bottom End", value: "bottom-end" },
              { label: "Bottom Start", value: "bottom-start" },
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
          <SegmentedControlYesNo
            label="Show in Editor"
            {...form.getInputProps("showInEditor")}
            onChange={(value) => {
              form.setFieldValue("showInEditor", value);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { showInEditor: value } },
              });
            }}
          />
        </Stack>
      </Stack>
    </form>
  );
});

export default Modifier;
