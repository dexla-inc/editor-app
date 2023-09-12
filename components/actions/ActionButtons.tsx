import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { Action } from "@/utils/actions";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

type Props = {
  actionId: string;
  componentActions: Action[];
  selectedComponentId: string | undefined;
  optionalRemoveAction?: () => void;
};

export const ActionButtons = ({
  actionId,
  componentActions,
  selectedComponentId,
  optionalRemoveAction,
}: Props) => {
  const [copied, { open, close }] = useDisclosure(false);
  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);
  const filteredComponentActions = componentActions.filter((a: Action) => {
    return a.id === actionId || a.sequentialTo === actionId;
  });

  const copyAction = () => {
    setCopiedAction(filteredComponentActions);
    open();
  };

  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions
  );

  const defaultRemoveAction = () => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== actionId && a.sequentialTo !== actionId;
      })
    );
  };

  const removeAction = optionalRemoveAction || defaultRemoveAction;

  useEffect(() => {
    const timeout = setTimeout(() => copied && close(), 2000);
    return () => clearTimeout(timeout);
  });

  return (
    <>
      <Button
        size="xs"
        type="submit"
        mt="xs"
        leftIcon={<Icon name="IconCheck"></Icon>}
      >
        Save
      </Button>
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
      <Button
        size="xs"
        type="button"
        variant="light"
        onClick={removeAction}
        color="red"
        leftIcon={<Icon name="IconTrash"></Icon>}
      >
        Remove
      </Button>
    </>
  );
};
