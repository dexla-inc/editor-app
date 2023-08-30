import { useDisclosure } from "@mantine/hooks";
import { Popover, Text, useMantineTheme } from "@mantine/core";
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
