import { useForm } from "@mantine/form";
import { Action } from "@/utils/actions";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { Stack } from "@mantine/core";
import { useEffect } from "react";
import { PageResponse } from "@/requests/pages/types";
import merge from "lodash.merge";

type Props = {
  action: Action;
  page: PageResponse;
  defaultValues: Record<string, any>;
  children?: (props: any) => JSX.Element;
  onUpdatePage: (values: any) => Promise<any>;
};

export const ActionSettingsForm = ({
  action,
  page,
  defaultValues,
  children,
  onUpdatePage,
}: Props) => {
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

  const onSubmit = async (values: any) => {
    const updatedActions = page.actions?.map((a) => {
      if (a.action.name === values.name) {
        a.action = { ...a.action, ...values };
      }
      return a;
    });
    const updatedPage = merge({}, page, { actions: updatedActions });

    try {
      await onUpdatePage(updatedPage);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing="xs">
      {children && children({ form })}
      <ActionButtons
        actionId={action.id}
        componentActions={page.actions ?? []}
        canAddSequential={action.action.name === "apiCall"}
      ></ActionButtons>
    </Stack>
  );
};
