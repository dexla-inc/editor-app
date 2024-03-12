import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Checkbox, SegmentedControl, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.drawer, {
        title: selectedComponent.props?.title,
        position: selectedComponent.props?.position,
        forceHide: selectedComponent.props?.forceHide,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <Textarea
          autosize
          label="Title"
          size="xs"
          {...form.getInputProps("title")}
          onChange={(e) => {
            form.setFieldValue("title", e.target.value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { title: e.target.value } },
            });
          }}
        />
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
                attrs: { props: { position: value } },
              });
            }}
          />
        </Stack>

        <Checkbox
          size="xs"
          label="Force Hide"
          {...form.getInputProps("forceHide", { type: "checkbox" })}
          onChange={(e) => {
            form.setFieldValue("forceHide", e.target.checked);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { forceHide: e.target.checked } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
