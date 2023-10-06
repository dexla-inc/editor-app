import { ComponentToBindInput } from "@/components/ComponentToBindInput";
import { VariablePicker } from "@/components/VariablePicker";
import { getPage } from "@/requests/pages/queries";
import { getVariable } from "@/requests/variables/queries";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { BindVariableToComponentAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Button, Loader, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<BindVariableToComponentAction, "name">;

export const BindVariableToComponentFlowActionForm = ({ form }: Props) => {
  const router = useRouter();
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const { setPickingComponentToBindTo, setComponentToBind, setTree } =
    useEditorStore();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const { data: page } = useQuery({
    queryKey: ["page", projectId, pageId],
    queryFn: async () => {
      return await getPage(projectId, pageId);
    },
    enabled: !!projectId && !!pageId,
  });

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
    <Stack spacing="xs">
      <ComponentToBindInput
        onPick={(componentToBind: string) => {
          form.setFieldValue("component", componentToBind);

          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps("component")}
      />

      <TextInput
        size="xs"
        placeholder="Select a variable"
        label="Variable"
        {...form.getInputProps("variable")}
        rightSection={
          <VariablePicker
            onSelectValue={(selected) => {
              form.setFieldValue("variable", selected);
            }}
          />
        }
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
