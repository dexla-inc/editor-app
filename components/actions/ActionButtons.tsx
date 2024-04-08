import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { Action } from "@/utils/actions";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { ActionIconDefault } from "../ActionIconDefault";

type Props = {
  actionId: string;
  componentActions: Action[];
  optionalRemoveAction?: () => void;
};

export const ActionButtons = ({
  actionId,
  componentActions,
  optionalRemoveAction: removeAction,
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

  useEffect(() => {
    const timeout = setTimeout(() => copied && close(), 200);
    return () => clearTimeout(timeout);
  });

  return (
    <>
      <ActionIconDefault
        onClick={copyAction}
        iconName="IconCopy"
        tooltip={copied ? "Copied" : "Copy"}
      />
      {removeAction && (
        <ActionIconDefault
          onClick={removeAction}
          iconName="IconTrash"
          tooltip="Remove"
        />
      )}
    </>
  );
};
