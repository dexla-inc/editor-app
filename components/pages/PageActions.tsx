import { ActionSettingsForm } from "@/components/pages/ActionSettingsForm";
import { SelectActionForm } from "@/components/pages/SelectActionForm";
import { SidebarSection } from "@/components/pages/SidebarSection";
import { PageResponse } from "@/requests/pages/types";
import { Action, actionMapper } from "@/utils/actions";
import { Box, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBadgeRight, IconBolt } from "@tabler/icons-react";
import startCase from "lodash.startcase";

type Props = {
  page?: PageResponse | null | undefined;
  onUpdatePage: (values: any) => Promise<any>;
};

export default function PageActions({ page, onUpdatePage }: Props) {
  const [addForm, { open, close }] = useDisclosure(false);

  const removeAction = async (id: string) => {
    if (page) {
      const updatedActions =
        page.actions?.filter(
          (a: Action) => a.id !== id && a.sequentialTo !== id,
        ) ?? [];

      const pageUpdated = { ...page, actions: updatedActions };

      await onUpdatePage(pageUpdated);
    }
  };

  const getActionsBySequentialToOrId = (id: string) => {
    return page?.actions?.filter(
      (a: Action) => a.id === id || a.sequentialTo === id,
    );
  };

  const renderSequentialActions = (action: Action) => {
    return getActionsBySequentialToOrId(action.id!)?.map(
      (sequentialAction: Action) => {
        const sequentialActionName = sequentialAction.action.name;

        if (!sequentialActionName) {
          return null;
        }

        const ActionForm = actionMapper[sequentialActionName]?.form;

        const item = {
          id: sequentialAction.id,
          isSequential: true,
          label: `${startCase(sequentialAction.trigger)}: ${startCase(
            sequentialAction.action.name,
          )}`,
          my: 20,
        };

        return (
          sequentialAction.sequentialTo === action.id && (
            <SidebarSection
              icon={IconArrowBadgeRight}
              isAction
              {...item}
              removeAction={removeAction}
              key={item.label}
            >
              <ActionSettingsForm
                action={sequentialAction}
                page={page!}
                defaultValues={
                  actionMapper[sequentialActionName]?.defaultValues
                }
                onUpdatePage={onUpdatePage}
              >
                {({ form }) => (
                  <ActionForm form={form} actionId={sequentialAction.id} />
                )}
              </ActionSettingsForm>
            </SidebarSection>
          )
        );
      },
    );
  };

  return (
    <Box>
      {!addForm && (
        <Button
          onClick={open}
          size="xs"
          type="button"
          variant="light"
          w={"100%"}
          m="xs"
          mr={0}
        >
          Add Action
        </Button>
      )}
      {addForm && (
        <SelectActionForm
          onUpdatePage={onUpdatePage}
          close={close}
          page={page!}
        />
      )}

      {page?.actions?.map((action) => {
        const actionMapped = actionMapper[action?.action?.name];

        return (
          !action.sequentialTo && (
            <SidebarSection
              key={action.id}
              id={action.id}
              isAction
              icon={IconBolt}
              removeAction={removeAction}
              label={`${startCase(action.trigger)}: ${startCase(
                action.action.name,
              )}`}
            >
              <ActionSettingsForm
                action={action}
                page={page!}
                defaultValues={actionMapped.defaultValues}
                onUpdatePage={onUpdatePage}
              >
                {({ form }) => {
                  const ActionForm = actionMapped.form;
                  return <ActionForm form={form} />;
                }}
              </ActionSettingsForm>
              {renderSequentialActions(action)}
            </SidebarSection>
          )
        );
      })}
    </Box>
  );
}
