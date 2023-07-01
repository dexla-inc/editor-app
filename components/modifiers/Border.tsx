import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBorderCorners,
  IconBorderStyle,
  IconSquare,
} from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { UnitInput } from "@/components/UnitInput";

export const icon = IconBorderStyle;
export const label = "Border";

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const debouncedTreeUpdate = debounce(updateTreeComponent, 200);

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: {
      showRadius: "radius-sides",
      borderRadius: "0px",
      borderTopLeftRadius: "0px",
      borderTopRightRadius: "0px",
      borderBottomLeftRadius: "0px",
      borderBottomRightRadius: "0px",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;
      form.setValues({
        borderRadius: style.borderRadius ?? "0px",
        borderTopLeftRadius: style.borderTopLeftRadius ?? "0px",
        borderTopRightRadius: style.borderTopRightRadius ?? "0px",
        borderBottomLeftRadius: style.borderBottomLeftRadius ?? "0px",
        borderBottomRightRadius: style.borderBottomRightRadius ?? "0px",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form key={selectedComponentId}>
      <Stack>
        <Stack spacing={4}>
          <Text size="0.75rem" weight={500}>
            Radius
          </Text>
          <Group noWrap>
            <SegmentedControl
              fullWidth
              size="sm"
              w="50%"
              data={[
                { label: <IconSquare size={14} />, value: "radius-all" },
                {
                  label: <IconBorderCorners size={14} />,
                  value: "radius-sides",
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
              {...form.getInputProps("showRadius")}
            />
            <UnitInput
              {...form.getInputProps("borderRadius")}
              onChange={(value) => {
                form.setValues({
                  borderRadius: value,
                  borderTopLeftRadius: value,
                  borderTopRightRadius: value,
                  borderBottomLeftRadius: value,
                  borderBottomRightRadius: value,
                });
                debouncedTreeUpdate(selectedComponentId as string, {
                  style: {
                    borderTopLeftRadius: value,
                    borderTopRightRadius: value,
                    borderBottomLeftRadius: value,
                    borderBottomRightRadius: value,
                  },
                });
              }}
            />
          </Group>
          {form.values.showRadius === "radius-sides" && (
            <>
              <Group noWrap>
                <UnitInput
                  label="Top Left"
                  {...form.getInputProps("borderTopLeftRadius")}
                  onChange={(value) => {
                    form.setFieldValue("borderTopLeftRadius", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { borderTopLeftRadius: value },
                    });
                  }}
                />
                <UnitInput
                  label="Top Right"
                  {...form.getInputProps("borderTopRightRadius")}
                  onChange={(value) => {
                    form.setFieldValue("borderTopRightRadius", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { borderTopRightRadius: value },
                    });
                  }}
                />
              </Group>
              <Group noWrap>
                <UnitInput
                  label="Bottom Left"
                  {...form.getInputProps("borderBottomLeftRadius")}
                  onChange={(value) => {
                    form.setFieldValue(
                      "borderBottomLeftRadius",
                      value as string
                    );
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { borderBottomLeftRadius: value },
                    });
                  }}
                />
                <UnitInput
                  label="Bottom Right"
                  {...form.getInputProps("borderBottomRightRadius")}
                  onChange={(value) => {
                    form.setFieldValue(
                      "borderBottomRightRadius",
                      value as string
                    );
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { borderBottomRightRadius: value },
                    });
                  }}
                />
              </Group>
            </>
          )}
        </Stack>
      </Stack>
    </form>
  );
};
