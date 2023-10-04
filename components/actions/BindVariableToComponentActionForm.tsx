import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { Action, BindVariableToComponentAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect } from "react";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { VariableResponse } from "@/requests/variables/types";
import { getVariable } from "@/requests/variables/queries";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { DataPicker } from "@/components/DataPicker";

type Props = {
  id: string;
};

type FormValues = Omit<BindVariableToComponentAction, "name">;

export const BindVariableToComponentActionForm = ({ id }: Props) => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } =
    useActionData<BindVariableToComponentAction>({
      actionId: id,
      editorTree,
      selectedComponentId,
    });
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const form = useForm<FormValues>({
    initialValues: {
      component: action.action.component,
      variable: action.action.variable,
      variableType: action.action.variableType,
      path: action.action.path,
    },
  });

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

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<BindVariableToComponentAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: values,
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const removeAction = () => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== id && a.sequentialTo !== id;
      }),
    );
  };

  useEffect(() => {
    if (componentToBind && pickingComponentToBindTo) {
      if (pickingComponentToBindTo.componentId === component?.id) {
        form.setValues({
          component: componentToBind,
        });

        setPickingComponentToBindTo(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component?.id, componentToBind, pickingComponentToBindTo]);

  useEffect(() => {
    if (form?.values?.variable && form?.values?.variableType === "OBJECT") {
      refetch();
    }
  }, [form?.values, refetch]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <TextInput
          size="xs"
          label="Component to bind"
          {...form.getInputProps(`component`)}
          rightSection={
            <ActionIcon
              onClick={() => {
                setPickingComponentToBindTo({
                  componentId: component?.id!,
                  trigger: action.trigger,
                  bindedId: action.action.component ?? "",
                });
              }}
            >
              <IconCurrentLocation size={ICON_SIZE} />
            </ActionIcon>
          }
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

        <ActionButtons
          actionId={id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
          optionalRemoveAction={removeAction}
        />
      </Stack>
    </form>
  );
};
