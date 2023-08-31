import { useDisclosure } from "@mantine/hooks";
import { Popover, Text, useMantineTheme } from "@mantine/core";
import React, { FC } from "react";
import { SavingDisplay } from "@/components/SavingDisplay";
import { useEditorStore, useTemporalStore } from "@/stores/editor";

const convertTimestampToTimeTaken = (timestamp: number) => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
};

export const ChangeHistoryPopover: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const changeHistory = useEditorStore((state) => state.changeHistory);
  const currentChangeHistoryRevision = useEditorStore(
    (state) => state.currentChangeHistoryRevision
  );
  const { pastStates } = useTemporalStore((state) => state);
  const [opened, { close, open }] = useDisclosure(true);
  const theme = useMantineTheme();

  console.log({ pastStates });

  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      radius="md"
      opened={opened}
    >
      <Popover.Target>
        <SavingDisplay
          isSaving={false}
          onMouseEnter={open}
          onMouseLeave={close}
        />
      </Popover.Target>
      <Popover.Dropdown
        sx={{
          pointerEvents: "none",
          padding: "10px 5px",
          width: "auto!important",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {changeHistory
            .map((item, index) => {
              const color =
                currentChangeHistoryRevision === index
                  ? theme.colors.blue[4]
                  : theme.colors.dark[9];
              return (
                <li key={index}>
                  <Text component="span" size="sm" color={color}>
                    {item}
                  </Text>
                  <Text component="span" size="xs" color={color}>
                    {" "}
                    (a few seconds ago)
                  </Text>
                </li>
              );
            })
            .reverse()}
        </ul>
      </Popover.Dropdown>
    </Popover>
  );
};
