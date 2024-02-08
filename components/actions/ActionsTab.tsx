import { ActionsForm } from "@/components/actions/ActionsForm";
import { Box, Button, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Action, actionMapper } from "@/utils/actions";
import startCase from "lodash.startcase";
import { SidebarSection } from "@/components/SidebarSection";
import { IconArrowBadgeRight, IconBolt } from "@tabler/icons-react";
import { Component } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";
import { ActionSettingsForm } from "@/components/actions/ActionSettingsForm";

type Props = {
  component: Component;
};

export const ActionsTab = ({ component }: Props) => {
  const openAction = useEditorStore((state) => state.openAction);
  const setOpenAction = useEditorStore((state) => state.setOpenAction);
  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );

  const [addForm, { open, close }] = useDisclosure(false);

  const getActionsBySequentialToOrId = (id: string) => {
    return component.actions?.filter(
      (a: Action) => a.id === id || a.sequentialTo === id,
    );
  };

  const renderSequentialActions = (action: Action) => {
    return getActionsBySequentialToOrId(action.id!)?.map(
      (sequentialAction: Action) => {
        const sequentialActionName = sequentialAction.action.name;
        const ActionForm = actionMapper[sequentialActionName]?.form;

        const item = {
          ...baseItem,
          id: sequentialAction.id,
          isSequential: true,
          label: `${startCase(sequentialAction.trigger)}: ${startCase(
            sequentialAction.action.name,
          )}`,
          initiallyOpened: openAction?.actionIds?.includes(
            `seq_${sequentialAction.id}`,
          ),
          my: 20,
        };

        return (
          sequentialAction.sequentialTo === action.id && (
            <SidebarSection
              icon={IconArrowBadgeRight}
              {...item}
              key={item.label}
            >
              {/*<ActionForm id={sequentialAction.id} />*/}
            </SidebarSection>
          )
        );
      },
    );
  };

  const copyAction = (id: string) => {
    setCopiedAction(getActionsBySequentialToOrId(id));
  };

  const removeAction = (id: string) => {
    const updatedActions =
      component.actions?.filter(
        (a: Action) => a.id !== id && a.sequentialTo !== id,
      ) ?? [];

    setOpenAction({
      ...openAction,
      actionIds: openAction?.actionIds?.filter(
        (a) => a !== id && a !== `seq_${id}`,
      ),
    });
    updateTreeComponentActions(component.id!, updatedActions);
  };

  const baseItem = {
    isAction: true,
    removeAction,
    copyAction,
    componentId: component.id,
    openAction,
  };

  const actionsSections = component.actions?.map((action: Action) => {
    const isSequential = !!action.sequentialTo;
    const actionName = action.action.name;

    const item = !isSequential
      ? {
          ...baseItem,
          id: action.id,
          label: `${startCase(action.trigger)}: ${startCase(actionName)}`,
          initiallyOpened: openAction?.actionIds?.includes(action.id),
        }
      : undefined;

    if (!actionName) return undefined;

    const ActionForm = actionMapper[actionName]?.form;

    return (
      item && (
        <SidebarSection icon={IconBolt} {...item} key={item.label}>
          <ActionSettingsForm
            action={action}
            defaultValues={actionMapper[actionName]?.defaultValues}
          >
            {({ form }) => <ActionForm form={form} />}
          </ActionSettingsForm>
          {renderSequentialActions(action)}
        </SidebarSection>
      )
    );
  });

  return (
    <Stack>
      <Box px="md">
        {!addForm && (
          <Button
            onClick={open}
            size="xs"
            type="button"
            variant="light"
            w={"100%"}
          >
            Add Action
          </Button>
        )}
        {addForm && <ActionsForm close={close} />}
      </Box>
      {actionsSections}
    </Stack>
  );
};
