import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ReloadComponentAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type FormValues = Omit<ReloadComponentAction, "name">;

type Props = {
  form: UseFormReturnType<FormValues>;
};

export const ReloadComponentFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const setTree = useEditorStore((state) => state.setTree);

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
    <>
      <Stack spacing="xs">
        <ComponentToBindFromInput
          onPickComponent={(componentToBind: string) => {
            form.setFieldValue("componentId", componentToBind);
          }}
          onPickVariable={(variable: string) => {
            form.setFieldValue("componentId", variable);
          }}
          size="xs"
          label="Component to reload"
          {...form.getInputProps("componentId")}
        />

        <Button type="submit" size="xs" loading={isUpdating}>
          Save
        </Button>
      </Stack>
    </>
  );
};
