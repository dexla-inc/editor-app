import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ChangeStateAction } from "@/utils/actions";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { decodeSchema } from "@/utils/compression";
import { getComponentById } from "@/utils/editor";
import { Button, Select, Stack, useMantineTheme } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<ChangeStateAction, "name">;

export const ChangeStateActionFlowForm = ({ form }: Props) => {
  const theme = useMantineTheme();
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const setTree = useEditorStore((state) => state.setTree);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const { getComponentsStates } = useComponentStates();

  const component = getComponentById(editorTree.root, selectedComponentId!);

  // const onChange = (val: string | null, key: string, i: number) => {
  //   const newValue = cloneDeep(form.values.conditionRules) as any;
  //   newValue[i][key] = val;
  //   form.setFieldValue("conditionRules", newValue);
  // };

  const conditionOptions =
    component?.name === "Select"
      ? component?.props?.data ?? component?.props?.exampleData
      : component?.children?.map((child) => ({
          label: child?.props?.value,
          value: child?.props?.value,
        }));

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput
        componentId={component?.id}
        onPickComponent={() => {
          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps("componentId")}
      />

      {/* This select must be bindable */}
      <Select
        size="xs"
        label="State"
        //onChange={(val) => onChange(val, "state", i)}
        data={getComponentsStates()}
        placeholder="Select State"
        nothingFound="Nothing found"
        searchable
        //value={state}
        styles={{ label: { width: "100%" } }}
        {...AUTOCOMPLETE_OFF_PROPS}
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
