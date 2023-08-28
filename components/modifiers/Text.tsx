import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { UnitInput } from "@/components/UnitInput";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Group, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextSize } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { SizeSelector } from "../SizeSelector";

export const icon = IconTextSize;
export const label = "Text";

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates
  );

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: {
      value: "",
      fontSize: "md",
      fontWeight: "",
      lineHeight: "",
      letterSpacing: "",
      color: "Black.6",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { children = "", style = {}, color } = componentProps;

      let data: any = {
        value: children,
        color,
      };

      const currentState =
        currentTreeComponentsStates?.[selectedComponentId] ?? "default";

      if (currentState !== "default") {
        data = {
          ...data,
          ...(selectedComponent?.states?.[currentState] ?? {}),
          style: {
            ...style,
            ...(selectedComponent?.states?.[currentState].style ?? {}),
          },
        };
      }

      form.setValues({
        value: data.value,
        color: data.color ?? "Black.6",
        ...data.style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  const debouncedUpdate = debounce((field: string, value: any) => {
    updateTreeComponent(selectedComponentId as string, {
      [field]: value,
    });
  }, 500);

  return (
    <form>
      <Stack spacing="xs">
        <Textarea
          autosize
          label="Value"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            debouncedUpdate("children", e.target.value);
          }}
        />
        <Group noWrap>
          <SizeSelector
            label="Size"
            {...form.getInputProps("fontSize")}
            onChange={(value) => {
              form.setFieldValue("fontSize", value as string);
              debouncedUpdate("size", value);
            }}
          />
          <Select
            label="Weight"
            size="xs"
            data={[
              { label: "Normal", value: "normal" },
              { label: "Bold", value: "bold" },
            ]}
            {...form.getInputProps("fontWeight")}
            onChange={(value) => {
              form.setFieldValue("fontWeight", value as string);
              debouncedUpdate("style", { fontWeight: value });
            }}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            label="Line Height"
            {...form.getInputProps("lineHeight")}
            onChange={(value) => {
              form.setFieldValue("lineHeight", value as string);
              debouncedUpdate("style", { lineHeight: value });
            }}
          />
          <UnitInput
            label="Letter Spacing"
            disabledUnits={["%"]}
            {...form.getInputProps("letterSpacing")}
            onChange={(value) => {
              form.setFieldValue("letterSpacing", value as string);
              debouncedUpdate("style", { letterSpacing: value });
            }}
          />
        </Group>
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedUpdate("color", value);
          }}
        />
      </Stack>
    </form>
  );
};
