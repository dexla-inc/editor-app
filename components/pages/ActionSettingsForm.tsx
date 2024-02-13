import { useForm } from "@mantine/form";
import { Action } from "@/utils/actions";
import { Button, Divider, Stack } from "@mantine/core";
import { useEffect } from "react";
import { PageResponse } from "@/requests/pages/types";
import merge from "lodash.merge";
import { Icon } from "@/components/Icon";
import { SelectActionForm } from "@/components/pages/SelectActionForm";
import { useDisclosure } from "@mantine/hooks";
import { ActionButtons } from "@/components/actions/ActionButtons";

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
  const [addSequentialForm, { open: openSequential, close: closeSequential }] =
    useDisclosure(false);

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
      {action.action.name === "apiCall" && (
        <Button
          size="xs"
          type="button"
          onClick={openSequential}
          variant="light"
          mt="xs"
          leftIcon={<Icon name="IconPlus"></Icon>}
        >
          Add Sequential Action
        </Button>
      )}
      {addSequentialForm && (
        <>
          <Divider my="lg" label="Sequential Action" labelPosition="center" />
          <SelectActionForm
            page={page}
            onUpdatePage={onUpdatePage}
            close={closeSequential}
            sequentialTo={action.id}
          />
        </>
      )}
      <ActionButtons
        actionId={action.id}
        componentActions={page.actions ?? []}
      />
    </Stack>
  );
};
