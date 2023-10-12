import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { OpenToastAction } from "@/utils/actions";
import { Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ApiType } from "@/utils/dashboardTypes";
import React from "react";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";

type Props = {
  id: string;
};

type FormValues = Omit<OpenToastAction, "name">;

export const OpenToastActionForm = ({ id }: Props) => {
  const { setComponentToBind, setPickingComponentToBindTo } = useEditorStore();
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<OpenToastAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      title: action.action.title,
      message: action.action.message,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<OpenToastAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { title: values.title, message: values.message },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing={2}>
        {[
          {
            title: "Title",
            name: "title" as ApiType,
          },
          {
            title: "Message",
            name: "message" as ApiType,
          },
        ].map(({ title, name }) => {
          return (
            <React.Fragment key={title}>
              <Title order={5} mt="md">
                {title}
              </Title>
              <ComponentToBindFromInput
                componentId={selectedComponentId}
                onPickComponent={(componentToBind: string) => {
                  form.setFieldValue(name, `valueOf_${componentToBind}`);

                  setPickingComponentToBindTo(undefined);
                  setComponentToBind(undefined);
                }}
                onPickVariable={(variable: string) => {
                  form.setFieldValue(name, variable);
                }}
                size="xs"
                label={title}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                {...form.getInputProps(name)}
              />
            </React.Fragment>
          );
        })}
      </Stack>
      <Stack spacing="xs">
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        />
      </Stack>
    </form>
  );
};
