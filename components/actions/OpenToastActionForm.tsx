import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { OpenToastAction } from "@/utils/actions";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ApiType } from "@/utils/dashboardTypes";
import { Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

type Props = {
  id: string;
};

type FormValues = Omit<OpenToastAction, "name">;

export const OpenToastActionForm = ({ id }: Props) => {
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<OpenToastAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      title: action.action?.title,
      message: action.action?.message,
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
                {...form.getInputProps(name)}
                {...AUTOCOMPLETE_OFF_PROPS}
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
