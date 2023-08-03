import { UnitInput } from "@/components/UnitInput";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Flex, NumberInput, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayout } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconLayout;
export const label = "Position";

export const defaultLayoutValues = {
  position: "relative",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px",
  zIndex: 0,
};

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const debouncedTreeUpdate = debounce(updateTreeComponent, 500);

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: defaultLayoutValues,
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;

      form.setValues({
        position: style.position ?? defaultLayoutValues.position,
        top: style.top ?? defaultLayoutValues.top,
        right: style.right ?? defaultLayoutValues.right,
        bottom: style.bottom ?? defaultLayoutValues.bottom,
        left: style.left ?? defaultLayoutValues.left,
        zIndex: style.zIndex ?? defaultLayoutValues.zIndex,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form key={selectedComponentId}>
      <Stack>
        <Stack spacing={2}>
          <Select
            label="Position"
            size="xs"
            data={[
              { label: "Relative", value: "relative" },
              { label: "Absolute", value: "absolute" },
              { label: "Sticky", value: "sticky" },
              { label: "Fixed", value: "fixed" },
            ]}
            {...form.getInputProps("position")}
            onChange={(value) => {
              form.setFieldValue("position", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { position: value },
              });
            }}
          />
          {["absolute", "sticky", "fixed"].includes(form.values.position) && (
            <>
              <Flex gap="sm">
                <UnitInput
                  label="Top"
                  {...form.getInputProps("top")}
                  onChange={(value) => {
                    form.setFieldValue("top", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { top: value },
                    });
                  }}
                />
                <UnitInput
                  label="Right"
                  {...form.getInputProps("right")}
                  onChange={(value) => {
                    form.setFieldValue("right", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { right: value },
                    });
                  }}
                />
              </Flex>
              <Flex gap="sm">
                <UnitInput
                  label="Bottom"
                  {...form.getInputProps("bottom")}
                  onChange={(value) => {
                    form.setFieldValue("bottom", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { bottom: value },
                    });
                  }}
                />
                <UnitInput
                  label="Left"
                  {...form.getInputProps("left")}
                  onChange={(value) => {
                    form.setFieldValue("left", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { left: value },
                    });
                  }}
                />
              </Flex>
            </>
          )}
        </Stack>
        <Stack spacing={2}>
          <NumberInput
            label="Z-Index"
            size="xs"
            {...form.getInputProps("zIndex")}
            onChange={(value) => {
              form.setFieldValue("zIndex", value as number);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { zIndex: value },
              });
            }}
          />
        </Stack>
      </Stack>
    </form>
  );
};
