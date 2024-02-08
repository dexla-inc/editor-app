import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { Action } from "@/utils/actions";
import { Button, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

type Props = {
  actionId: string;
  componentActions: Action[];
  optionalRemoveAction?: () => void;
  canAddSequential?: boolean;
};

export const ActionButtons = ({
  actionId,
  componentActions,
  optionalRemoveAction: removeAction,
  canAddSequential = false,
}: Props) => {
  const [copied, { open, close }] = useDisclosure(false);
  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);
  const setSequentialTo = useEditorStore((state) => state.setSequentialTo);
  const filteredComponentActions = componentActions.filter((a: Action) => {
    return a.id === actionId || a.sequentialTo === actionId;
  });

  const copyAction = () => {
    setCopiedAction(filteredComponentActions);
    open();
  };

  const addSequentialAction = () => setSequentialTo(actionId);

  useEffect(() => {
    const timeout = setTimeout(() => copied && close(), 2000);
    return () => clearTimeout(timeout);
  });

  return (
    <Stack>
      <Button
        size="xs"
        type="submit"
        mt="xs"
        leftIcon={<Icon name="IconCheck"></Icon>}
      >
        Save
      </Button>
      {canAddSequential && (
        <Button
          size="xs"
          type="button"
          onClick={addSequentialAction}
          variant="light"
          mt="xs"
          leftIcon={<Icon name="IconPlus"></Icon>}
        >
          Add Sequential Action
        </Button>
      )}
      <Button
        size="xs"
        type="button"
        variant="light"
        color="yellow"
        onClick={copyAction}
        leftIcon={<Icon name="IconCopy"></Icon>}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
      {removeAction && (
        <Button
          size="xs"
          type="button"
          variant="light"
          color="red"
          onClick={removeAction}
          leftIcon={<Icon name="IconTrash"></Icon>}
        >
          Remove
        </Button>
      )}
    </Stack>
  );
};
