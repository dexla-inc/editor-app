import { SavingDisplay } from "@/components/SavingDisplay";
import {
  DARK_MODE,
  GRAY_WHITE_COLOR,
  THIN_DARK_OUTLINE,
  THIN_GRAY_OUTLINE,
} from "@/utils/branding";
import { Button, Flex, Popover, Text, UnstyledButton } from "@mantine/core";
import { FC, useState } from "react";
import { ActionIconDefault } from "./ActionIconDefault";
import { useUndoRedo } from "@/hooks/editor/useUndoRedo";
import Link from "next/link";
import { useEditorTreeStore } from "@/stores/editorTree";

const convertTimestampToTimeTaken = (timestamp: number) => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return `a few seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
};

export const ChangeHistoryPopover: FC = () => {
  const { undo, redo, historyCount } = useUndoRedo();
  const [opened, setOpened] = useState(false);
  const setTree = useEditorTreeStore((state) => state.setTree);

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const initialTree = () => {
    const pageLoadTree = useEditorTreeStore.getState().pageLoadTree;
    if (pageLoadTree) {
      setTree(pageLoadTree, {
        action: "Back to initial state",
      });
    }
  };

  return (
    <Flex
      align="center"
      gap={4}
      p={4}
      sx={(theme) => ({
        border:
          theme.colorScheme === "dark" ? THIN_DARK_OUTLINE : THIN_GRAY_OUTLINE,
        borderRadius: theme.radius.sm,
        background: theme.colorScheme === "dark" ? DARK_MODE : GRAY_WHITE_COLOR,
      })}
    >
      <Button.Group>
        <ActionIconDefault
          iconName="IconArrowBackUp"
          tooltip="Undo"
          onClick={undo}
          // @ts-ignore
          disabled={historyCount && historyCount > 0}
          size="sm"
          radius={"4px 0px 0px 4px"}
        />
        <ActionIconDefault
          iconName="IconArrowForwardUp"
          tooltip="Redo"
          onClick={redo}
          disabled={historyCount === null || historyCount === 0}
          radius={"0px 4px 4px 0px"}
          size="sm"
        />
      </Button.Group>
      <div
        onMouseEnter={open}
        onMouseLeave={(e) => {
          // Check if the related target (the element the pointer is moving to) is within the popover dropdown
          if (
            e.relatedTarget &&
            (e.relatedTarget as HTMLElement).closest(".popover-dropdown")
          ) {
            return;
          }
          close();
        }}
      >
        <Popover position="bottom" withArrow shadow="md" opened={opened}>
          <Popover.Target>
            <SavingDisplay />
          </Popover.Target>
          <Popover.Dropdown
            className="popover-dropdown"
            onMouseEnter={open}
            onMouseLeave={close}
            sx={{ pointerEvents: "auto", padding: 4 }}
          >
            <Button variant="link" size="xs" onClick={initialTree}>
              Back to initial state
            </Button>
          </Popover.Dropdown>
        </Popover>
      </div>
    </Flex>
  );
};
