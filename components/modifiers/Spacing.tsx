import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBorderSides,
  IconBoxModel2,
  IconSquare,
} from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { UnitInput } from "@/components/UnitInput";

export const icon = IconBoxModel2;
export const label = "Spacing";

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
      showPadding: "padding-sides",
      padding: "0px",
      paddingTop: "0px",
      paddingBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",

      showMargin: "margin-sides",
      margin: "0px",
      marginTop: "0px",
      marginBottom: "0px",
      marginLeft: "0px",
      marginRight: "0px",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;
      form.setValues({
        padding: style.padding ?? "0px",
        paddingTop: style.paddingTop ?? "0px",
        paddingBottom: style.paddingBottom ?? "0px",
        paddingLeft: style.paddingLeft ?? "0px",
        paddingRight: style.paddingRight ?? "0px",

        margin: style.margin ?? "0px",
        marginTop: style.marginTop ?? "0px",
        marginBottom: style.marginBottom ?? "0px",
        marginLeft: style.marginLeft ?? "0px",
        marginRight: style.marginRight ?? "0px",
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
            Padding
          </Text>
          <Group noWrap>
            <SegmentedControl
              fullWidth
              size="sm"
              w="50%"
              data={[
                { label: <IconSquare size={14} />, value: "padding-all" },
                {
                  label: <IconBorderSides size={14} />,
                  value: "padding-sides",
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
              {...form.getInputProps("showPadding")}
            />
            <UnitInput
              {...form.getInputProps("padding")}
              onChange={(value) => {
                form.setValues({
                  padding: value,
                  paddingTop: value,
                  paddingBottom: value,
                  paddingLeft: value,
                  paddingRight: value,
                });
                debouncedTreeUpdate(selectedComponentId as string, {
                  style: {
                    paddingTop: value,
                    paddingBottom: value,
                    paddingLeft: value,
                    paddingRight: value,
                  },
                });
              }}
            />
          </Group>
          {form.values.showPadding === "padding-sides" && (
            <>
              <Group noWrap>
                <UnitInput
                  label="Top"
                  {...form.getInputProps("paddingTop")}
                  onChange={(value) => {
                    form.setFieldValue("paddingTop", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { paddingTop: value },
                    });
                  }}
                />
                <UnitInput
                  label="Bottom"
                  {...form.getInputProps("paddingBottom")}
                  onChange={(value) => {
                    form.setFieldValue("paddingBottom", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { paddingBottom: value },
                    });
                  }}
                />
              </Group>
              <Group noWrap>
                <UnitInput
                  label="Left"
                  {...form.getInputProps("paddingLeft")}
                  onChange={(value) => {
                    form.setFieldValue("paddingLeft", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { paddingLeft: value },
                    });
                  }}
                />
                <UnitInput
                  label="Right"
                  {...form.getInputProps("paddingRight")}
                  onChange={(value) => {
                    form.setFieldValue("paddingRight", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { paddingRight: value },
                    });
                  }}
                />
              </Group>
            </>
          )}
        </Stack>
        <Stack spacing={4}>
          <Text size="0.75rem" weight={500}>
            Margin
          </Text>
          <Group noWrap>
            <SegmentedControl
              fullWidth
              size="sm"
              w="50%"
              data={[
                { label: <IconSquare size={14} />, value: "margin-all" },
                {
                  label: <IconBorderSides size={14} />,
                  value: "margin-sides",
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
              {...form.getInputProps("showMargin")}
            />
            <UnitInput
              {...form.getInputProps("margin")}
              onChange={(value) => {
                form.setValues({
                  margin: value,
                  marginTop: value,
                  marginBottom: value,
                  marginLeft: value,
                  marginRight: value,
                });
                debouncedTreeUpdate(selectedComponentId as string, {
                  style: {
                    marginTop: value,
                    marginBottom: value,
                    marginLeft: value,
                    marginRight: value,
                  },
                });
              }}
            />
          </Group>
          {form.values.showMargin === "margin-sides" && (
            <>
              <Group noWrap>
                <UnitInput
                  label="Top"
                  {...form.getInputProps("marginTop")}
                  onChange={(value) => {
                    form.setFieldValue("marginTop", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { marginTop: value },
                    });
                  }}
                />
                <UnitInput
                  label="Bottom"
                  {...form.getInputProps("marginBottom")}
                  onChange={(value) => {
                    form.setFieldValue("marginBottom", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { marginBottom: value },
                    });
                  }}
                />
              </Group>
              <Group noWrap>
                <UnitInput
                  label="Left"
                  {...form.getInputProps("marginLeft")}
                  onChange={(value) => {
                    form.setFieldValue("marginLeft", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { marginLeft: value },
                    });
                  }}
                />
                <UnitInput
                  label="Right"
                  {...form.getInputProps("marginRight")}
                  onChange={(value) => {
                    form.setFieldValue("marginRight", value as string);
                    debouncedTreeUpdate(selectedComponentId as string, {
                      style: { marginRight: value },
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
