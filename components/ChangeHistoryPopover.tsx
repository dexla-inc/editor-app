import { Icon } from "@/components/Icon";
import { SavingDisplay } from "@/components/SavingDisplay";
import {
  debouncedUpdatePageState,
  useEditorStore,
  useTemporalStore,
} from "@/stores/editor";
import { encodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Button,
  Flex,
  List,
  Popover,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBackUp } from "@tabler/icons-react";
import { FC, useEffect } from "react";

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
  const [historyIndex, setHistoryIndex] = useState(0);
  const currentState = useEditorStore((state) => ({
    isSaving: state.isSaving,
    tree: {
      name: state.tree.name,
      timestamp: state.tree.timestamp,
    },
  }));

  const pageId = useEditorStore((state) => state.currentPageId);

  const { changeHistory, pastStates, undo, redo, futureStates, clear } =
    useTemporalStore((state) => ({
      changeHistory: [
        ...state.pastStates,
        currentState,
        ...state.futureStates,
      ].reduce(
        (acc, { tree }, index) => {
          return index === 0
            ? acc
            : acc.concat({
                name: tree?.name,
                timestamp: tree?.timestamp,
              });
        },
        [] as Array<{
          name?: string;
          timestamp?: number;
        }>,
      ),
      pastStates: state.pastStates,
      futureStates: state.futureStates,
      undo: state.undo,
      redo: state.redo,
      clear: state.clear,
    }));

  useEffect(
    () => clear(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageId],
  );

  const [opened, { close, open }] = useDisclosure(false);
  const theme = useMantineTheme();

  const handlePageStateChange = (
    operation: (steps?: number | undefined) => void,
  ) => {
    operation();
    const currentState = useEditorStore.getState();
    debouncedUpdatePageState(
      encodeSchema(JSON.stringify(currentState.tree)),
      currentState.currentProjectId ?? "",
      currentState.currentPageId ?? "",
      currentState.setIsSaving,
    );
  };

  return (
    <Flex
      align="center"
      gap={4}
      p={4}
      bg="gray.0"
      sx={(theme) => ({
        border: `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.sm,
      })}
    >
      <Button.Group>
        <Tooltip label="Undo" fz="xs">
          <ActionIcon
            variant="default"
            onClick={() => handlePageStateChange(undo)}
            disabled={setButtonDisabled}
            radius={"4px 0px 0px 4px"}
            size="sm"
          >
            <IconArrowBackUp size={ICON_SIZE} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Redo" fz="xs">
          <ActionIcon
            variant="default"
            onClick={() => handlePageStateChange(redo)}
            disabled={futureStates.length === 0}
            radius={"0px 4px 4px 0px"}
            size="sm"
          >
            <Icon name="IconArrowForwardUp" />
          </ActionIcon>
        </Tooltip>
      </Button.Group>
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
            <SavingDisplay isSaving={currentState.isSaving} />
          </Popover.Target>
          <Popover.Dropdown
            sx={{
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
              {filteredHistory
                .map((item: any, index: number) => {
                  const currentHistoryIndex = pastStates.length - 1;
                  const color =
                    currentHistoryIndex === index
                      ? "indigo"
                      : theme.colors.dark[9];
                  return (
                    <List.Item
                      px={3}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { background: theme.colors.gray[0] },
                      }}
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newChangeHistoryIndex =
                          currentHistoryIndex - index - historyIndex;

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
                        {" "}
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
          </Popover.Dropdown>
        </Popover>
      </div>{" "}
    </Flex>
  );
};
