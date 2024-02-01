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
import { ShowNotificationAction } from "@/utils/actions";
import { ApiType } from "@/utils/dashboardTypes";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";

type Props = {
  id: string;
};

type FormValues = Omit<ShowNotificationAction, "name">;

export const ShowNotificationActionForm = ({ id }: Props) => {
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
  const { componentActions, action } = useActionData<ShowNotificationAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      title: action.action?.title,
      message: action.action?.message,
      actionCode: action.action?.actionCode ?? {},
      color: action.action?.color ?? "Primary.6",
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<ShowNotificationAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          title: values.title,
          message: values.message,
          actionCode: values.actionCode,
          color: values.color,
        },
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
              <ComponentToBindFromInput
                label={title}
                componentId={selectedComponentId}
                onPickComponent={(componentToBind: string) => {
                  form.setFieldValue(name, `valueOf_${componentToBind}`);

                  setPickingComponentToBindTo(undefined);
                  setComponentToBind(undefined);
                }}
                {...form.getInputProps(name)}
              />
            </React.Fragment>
          );
        })}
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
          }}
          excludeTransparent
        />
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
