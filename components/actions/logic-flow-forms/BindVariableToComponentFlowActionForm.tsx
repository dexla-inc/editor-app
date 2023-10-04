import { ComponentToBindInput } from "@/components/ComponentToBindInput";
import { DataPicker } from "@/components/DataPicker";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { getPage } from "@/requests/pages/queries";
import { getVariable } from "@/requests/variables/queries";
import { VariableResponse } from "@/requests/variables/types";
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

  const {
    data: variable,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["variable", form.values.variable],
    queryFn: async () => {
      const response = await getVariable(
        router.query.id as string,
        form.values.variable!,
      );
      return response;
    },
    enabled: !!form.values.variable,
  });

  useEffect(() => {
    if (form?.values?.variable && form?.values?.variableType === "OBJECT") {
      refetch();
    }
  }, [form?.values, refetch]);

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

      <VariableSelect
        {...form.getInputProps("variable")}
        onPick={(variable: VariableResponse) => {
          form.setFieldValue("variable", variable.id);
          form.setFieldValue("variableType", variable.type);
        }}
      />

      {form.values.variableType === "OBJECT" && (
        <TextInput
          size="xs"
          placeholder="Enter path to value"
          label="Path"
          {...form.getInputProps("path")}
          rightSection={
            isLoading ? (
              <Loader size="xs" />
            ) : (
              <DataPicker
                data={
                  Array.isArray(JSON.parse(variable?.value ?? "{}"))
                    ? JSON.parse(variable?.value ?? "{}").filter(
                        (_: any, i: number) => i == 0,
                      )
                    : JSON.parse(variable?.value ?? "{}")
                }
                onSelectValue={(selected) => {
                  form.setFieldValue("path", selected);
                }}
              />
            )
          }
        />
      )}

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
