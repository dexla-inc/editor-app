import { useDisclosure } from "@mantine/hooks";
import { Popover, Text } from "@mantine/core";
import React, { FC } from "react";
import { SavingDisplay } from "@/components/SavingDisplay";
import { useEditorStore } from "@/stores/editor";

export const ChangeHistoryPopover: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const changeHistory = useEditorStore((state) => state.changeHistory);
  const currentChangeHistoryRevision = useEditorStore(
    (state) => state.currentChangeHistoryRevision
  );

  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <SavingDisplay
          isSaving={false}
          onMouseEnter={open}
          onMouseLeave={close}
        />
      </Popover.Target>
      <Popover.Dropdown sx={{ pointerEvents: "none", zIndex: 999999 }}>
        <ul>
          {changeHistory.map((item, index) => (
            <li key={index}>
              {item} {currentChangeHistoryRevision === index ? " - active" : ""}
            </li>
          ))}
        </ul>
      </Popover.Dropdown>
    </Popover>
  );
};
