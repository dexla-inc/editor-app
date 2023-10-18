import { Icon } from "@/components/Icon";
import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { getChatHistoryList } from "@/requests/ai/queries";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import TOML from "@iarna/toml";
import {
  ActionIcon,
  Badge,
  Box,
  Collapse,
  Flex,
  Modal,
  Stack,
  Table,
  Tabs,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Prism } from "@mantine/prism";
import { IconBrandHipchat, IconJson, IconToml } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  projectId: string;
  pageTitle?: string | undefined;
};

type ContentOpenedType = { [id: string]: boolean };

export const AIChatHistoryButton = ({ projectId }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [contentOpened, setContentOpened] = useState<ContentOpenedType>({});
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");

  const chatHistoryList = useQuery({
    queryKey: ["chatHistory"],
    queryFn: () => getChatHistoryList(projectId),
  });

  const refreshChatHistory = () => {
    chatHistoryList.refetch();
  };

  const toggle = (id: string) => {
    setContentOpened((prev: ContentOpenedType) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setTooltipText("Copied to clipboard");

    // Reset the tooltip text after a certain time (e.g., 3 seconds)
    setTimeout(() => {
      setTooltipText("Copy to clipboard");
    }, 3000);
  };

  const rows = chatHistoryList.data?.results.map((element) => (
    <tr key={element.id}>
      <td>
        <Badge>{element.role}</Badge>
      </td>
      <td>
        <Badge color="blue">{element.requestType}</Badge>
      </td>
      <td>{new Date(element.created).toLocaleString()}</td>
      <td style={{ whiteSpace: "pre-wrap" }}>
        <Box
          onClick={() => toggle(element.id)}
          p="xs"
          sx={{ cursor: "pointer", ...buttonHoverStyles(theme) }}
        >
          <Flex justify="space-between">
            {contentOpened[element.id] ? (
              <Collapse in={contentOpened[element.id]}>
                {element.role === "ASSISTANT" ? (
                  <Tabs
                    variant="pills"
                    defaultValue="json"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <Tabs.List>
                      <Tabs.Tab
                        value="json"
                        icon={<IconJson size={LARGE_ICON_SIZE} />}
                      ></Tabs.Tab>
                      <Tabs.Tab
                        value="toml"
                        icon={<IconToml size={LARGE_ICON_SIZE} />}
                      ></Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="json" pt="xs">
                      <Prism language="json" noCopy>
                        {(() => {
                          try {
                            const json = TOML.parse(element.content);
                            return JSON.stringify(json, null, 2);
                          } catch {
                            return element.content;
                          }
                        })()}
                      </Prism>
                    </Tabs.Panel>

                    <Tabs.Panel value="toml" pt="xs">
                      <Prism language="tsx" noCopy>
                        {element.content}
                      </Prism>
                    </Tabs.Panel>
                  </Tabs>
                ) : (
                  <Prism language="tsx" noCopy>
                    {element.content}
                  </Prism>
                )}
              </Collapse>
            ) : (
              <Text>
                {element.content.length > 100
                  ? `${element.content.substring(0, 100)} ...........`
                  : element.content}
              </Text>
            )}
            <Tooltip label={tooltipText} fz="xs">
              <ActionIcon
                variant="transparent"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  copyToClipboard(element.content);
                }}
                color="yellow"
              >
                <Icon name="IconCopy" size={ICON_SIZE} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>
      </td>
    </tr>
  ));

  return (
    <>
      <Tooltip label="AI History" withArrow fz="xs">
        <ActionIcon
          onClick={() => {
            refreshChatHistory();
            open();
          }}
          variant="default"
        >
          <IconBrandHipchat size={ICON_SIZE} />
        </ActionIcon>
      </Tooltip>
      <Modal size="90%" opened={opened} onClose={close} title="Chat History">
        <Stack>
          <Table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Request Type</th>
                <th>Created</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Stack>
      </Modal>
    </>
  );
};
