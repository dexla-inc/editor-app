import { useActionData } from "@/components/actions/_BaseActionFunctions";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ReloadComponentAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect } from "react";

type FormValues = Omit<ReloadComponentAction, "name">;

type Props = {
  id: string;
  form: UseFormReturnType<FormValues>;
};

export const ReloadComponentFlowActionForm = ({ id, form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const { tree: editorTree, selectedComponentId, setTree } = useEditorStore();
  const { action } = useActionData<ReloadComponentAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo,
  );
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );

  useEffect(() => {
    if (pickingComponentToBindTo) {
      if (
        componentToBind &&
        pickingComponentToBindTo.componentId === component?.id
      ) {
        form.setFieldValue("componentId", componentToBind);
        const _componentToBind = getComponentById(
          editorTree.root,
          componentToBind,
        );
        const onMountAction = _componentToBind?.actions?.find(
          (action) => action.trigger === "onMount",
        );

        form.setFieldValue("onMountActionId", onMountAction?.id);

        setPickingComponentToBindTo(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component?.id, componentToBind, pickingComponentToBindTo]);

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
    <>
      <Stack spacing="xs">
        <TextInput
          size="xs"
          label="Component to reload"
          {...form.getInputProps("componentId")}
          rightSection={
            <ActionIcon
              onClick={() => {
                setPickingComponentToBindTo({
                  componentId: component?.id!,
                  trigger: action.trigger,
                  bindedId: form.values.componentId ?? "",
                });
              }}
            >
              <IconCurrentLocation size={ICON_SIZE} />
            </ActionIcon>
          }
          autoComplete="off"
        />

        <Button type="submit" size="xs" loading={isUpdating}>
          Save
        </Button>
      </Stack>
    </>
  );
};
