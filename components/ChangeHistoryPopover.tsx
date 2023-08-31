import { useDisclosure } from "@mantine/hooks";
import { Popover, Text, useMantineTheme } from "@mantine/core";
import React, { FC } from "react";
import { SavingDisplay } from "@/components/SavingDisplay";
import { useEditorStore, useTemporalStore } from "@/stores/editor";

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

export const ChangeHistoryPopover: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentState = useEditorStore((state) => state);
  const { changeHistory, pastStates } = useTemporalStore((state) => ({
    changeHistory: [
      ...state.pastStates,
      currentState,
      ...state.futureStates,
    ].reduce((acc, { tree }, index) => {
      return index === 0
        ? acc
        : acc.concat({
            name: tree?.name,
            timestamp: tree?.timestamp,
          });
    }, [] as Array<{ name?: string; timestamp?: number }>),
    pastStates: state.pastStates,
  }));
  const [opened, { close, open }] = useDisclosure(true);
  const theme = useMantineTheme();

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
                pastStates.length - 1 === index
                  ? theme.colors.blue[4]
                  : theme.colors.dark[9];
              return (
                <li key={index}>
                  <Text component="span" size="sm" color={color}>
                    {item.name}
                  </Text>
                  <Text component="span" size="xs" color={color}>
                    {" "}
                    ({convertTimestampToTimeTaken(item.timestamp || Date.now())}
                    )
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
