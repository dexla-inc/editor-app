import { TopLabel } from "@/components/TopLabel";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutSidebarLeftCollapse } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconLayoutSidebarLeftCollapse;
export const label = "Drawer";

const Modifier = withModifier(({ selectedComponent, selectedComponentIds }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.drawer, {
        title: selectedComponent.props?.title,
        position: selectedComponent.props?.position,
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
      </Stack>
    </form>
  );
});

export default Modifier;
