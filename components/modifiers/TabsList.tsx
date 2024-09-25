import { TopLabel } from "@/components/TopLabel";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Checkbox, SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutDistributeHorizontal,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.tabsList, {
        position: selectedComponent.props?.position,
        disableLine: selectedComponent.props?.disableLine,
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
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { position: value } },
              });
            }}
          />
        </Stack>
        <Checkbox
          size="xs"
          label="Disable line"
          {...form.getInputProps("disableLine", { type: "checkbox" })}
          onChange={(e) => {
            form.setFieldValue("disableLine", e.target.checked);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { disableLine: e.target.checked } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
