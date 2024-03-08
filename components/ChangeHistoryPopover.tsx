import { SavingDisplay } from "@/components/SavingDisplay";
import { usePreventNavigationOnSaving } from "@/hooks/usePreventNavigationOnSaving";
import { useEditorStore } from "@/stores/editor";
import {
  DARK_MODE,
  GRAY_WHITE_COLOR,
  THIN_DARK_OUTLINE,
  THIN_GRAY_OUTLINE,
} from "@/utils/branding";
import { Flex, Popover, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC } from "react";

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
  usePreventNavigationOnSaving();
  const pageId = useEditorStore((state) => state.currentPageId);
  //const editorTree = useEditorTreeStore((state) => state.tree);
  const currentProjectId = useEditorStore((state) => state.currentProjectId);
  const setIsSaving = useEditorStore((state) => state.setIsSaving);

  // TODO: Turning off for now, will need to revisit
  // const { changeHistory, pastStates, undo, redo, futureStates } =
  //   useTemporalStore((state) => ({
  //     changeHistory: [
  //       ...state.pastStates,
  //       {
  //         tree: {
  //           name: tree.name,
  //           timestamp: tree.timestamp,
  //         },
  //       },
  //       ...state.futureStates,
  //     ].reduce(
  //       (acc, { tree }, index) => {
  //         return index === 0
  //           ? acc
  //           : acc.concat({
  //               name: tree?.name,
  //               timestamp: tree?.timestamp,
  //             });
  //       },
  //       [] as Array<{
  //         name?: string;
  //         timestamp?: number;
  //       }>,
  //     ),
  //     pastStates: state.pastStates,
  //     futureStates: state.futureStates,
  //     undo: state.undo,
  //     redo: state.redo,
  //   }));

  const [opened, { close, open }] = useDisclosure(false);
  const theme = useMantineTheme();

  // const handlePageStateChange = (
  //   operation: (steps?: number | undefined) => void,
  // ) => {
  //   operation();
  //   debouncedUpdatePageState(
  //     encodeSchema(JSON.stringify(tree)),
  //     currentProjectId ?? "",
  //     pageId ?? "",
  //   );
  // };

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
      {/* <Button.Group>
        <ActionIconDefault
          iconName="IconArrowBackUp"
          tooltip="Undo"
          onClick={() => handlePageStateChange(undo)}
          disabled={pastStates.length < 2}
          size="sm"
          radius={"4px 0px 0px 4px"}
        />
        <ActionIconDefault
          iconName="IconArrowForwardUp"
          tooltip="Redo"
          onClick={() => handlePageStateChange(redo)}
          disabled={futureStates.length === 0}
          radius={"0px 4px 4px 0px"}
          size="sm"
        />
      </Button.Group> */}
      <div onMouseEnter={open} onMouseLeave={close}>
        <Popover
          width={200}
          position="bottom"
          withArrow
          shadow="md"
          radius="md"
          opened={opened}
          withinPortal
          offset={0}
        >
          <Popover.Target>
            <SavingDisplay />
          </Popover.Target>
          {/* <Popover.Dropdown
            sx={{
              display: changeHistory.length ? "block" : "none",
              padding: "10px 5px",
              width: "auto!important",
            }}
          >
            <List
              listStyleType="none"
              p={0}
              m={0}
              mah={200}
              style={{
                overflowY: "auto",
              }}
            >
              {changeHistory
                .map((item: any, index: number) => {
                  const currentHistoryIndex = pastStates.length - 1;
                  const isCurrentHistory = currentHistoryIndex === index;
                  const isDarkTheme = theme.colorScheme === "dark";

                  let color;
                  if (isCurrentHistory) {
                    color = isDarkTheme ? "indigo" : "gray";
                  } else {
                    color = isDarkTheme ? GRAY_COLOR : theme.colors.dark[9];
                  }
                  return (
                    <List.Item
                      px={3}
                      sx={(theme) => ({
                        cursor: "pointer",
                        "&:hover": {
                          background:
                            theme.colorScheme === "dark"
                              ? DARK_COLOR
                              : GRAY_WHITE_COLOR,
                        },
                      })}
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newChangeHistoryIndex =
                          currentHistoryIndex - index;

                        newChangeHistoryIndex >= 0
                          ? handlePageStateChange(() =>
                              undo(newChangeHistoryIndex),
                            )
                          : handlePageStateChange(() =>
                              redo(Math.abs(newChangeHistoryIndex)),
                            );
                      }}
                    >
                      <Text component="span" size="sm" color={color}>
                        {item.name}
                      </Text>
                      <Text component="span" size="xs" color={color}>
                        (
                        {convertTimestampToTimeTaken(
                          item.timestamp || Date.now(),
                        )}
                        )
                      </Text>
                    </List.Item>
                  );
                })
                .reverse()}
            </List>
          </Popover.Dropdown> */}
        </Popover>
      </div>
    </Flex>
  );
};
