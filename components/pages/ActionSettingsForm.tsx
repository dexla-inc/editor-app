import { useForm } from "@mantine/form";
import { Action, ChangeLanguageAction } from "@/utils/actions";
import {
  updateActionInTree,
  useActionData,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { Stack } from "@mantine/core";
import { useEffect } from "react";
import { updatePage } from "@/requests/pages/mutations";

type Props = {
  action: Action;
  pageActions: Action[];
  defaultValues: Record<string, any>;
  children?: (props: any) => JSX.Element;
};

export const ActionSettingsForm = ({
  action,
  pageActions,
  defaultValues,
  children,
}: Props) => {
  const projectId = useEditorStore((state) => state.currentProjectId!);
  const pageId = useEditorStore((state) => state.currentPageId!);

  const form = useForm({
    initialValues: { ...defaultValues, ...action.action },
  });

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout = "";
    if (form.isTouched() && form.isDirty()) {
      timeout = setTimeout(() => onSubmit(form.values), 200);
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const onSubmit = async (updateValues: any) => {
    try {
      await updatePage(updateValues, projectId, pageId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing="xs">
      {children && children({ form })}
      <ActionButtons
        actionId={action.id}
        componentActions={pageActions}
        canAddSequential={action.action.name === "apiCall"}
      ></ActionButtons>
    </Stack>
  );
};
