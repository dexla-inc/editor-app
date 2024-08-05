import { Icon } from "@/components/Icon";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { SelectActionForm } from "@/components/pages/SelectActionForm";
import { patchPage } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { convertToPatchParams } from "@/types/dashboardTypes";
import { Action } from "@/utils/actions";
import { Button, Divider, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

type Props = {
  action: Action;
  page: PageResponse;
  projectId: string;
  defaultValues: Record<string, any>;
  children?: (props: any) => JSX.Element;
  setPage: (page?: PageResponse | null | undefined) => void;
};

export const ActionSettingsForm = ({
  action,
  page,
  projectId,
  defaultValues,
  setPage,
  children,
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
      if (a.id === action.id) {
        a.action = { ...a.action, ...values };
      }
      return a;
    });

    const patchParams = convertToPatchParams({ actions: updatedActions });

    try {
      const result = await patchPage(projectId, page.id, patchParams);
      setPage(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing="xs">
      {children && children({ form })}
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
      {addSequentialForm && (
        <>
          <Divider my="lg" label="Sequential Action" labelPosition="center" />
          <SelectActionForm
            page={page}
            close={closeSequential}
            sequentialTo={action.id}
            setPage={setPage}
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
