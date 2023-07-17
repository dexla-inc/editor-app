import { getChatHistoryList } from "@/requests/ai/queries";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Badge,
  Box,
  Collapse,
  Flex,
  Modal,
  Stack,
  Table,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Prism } from "@mantine/prism";
import { IconBrandHipchat, IconCopy } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { buttonHoverStyles } from "./styles/buttonHoverStyles";

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
                <Prism language="tsx" noCopy>
                  {element.content}
                </Prism>
              </Collapse>
            ) : (
              <Text>
                {element.content.length > 100
                  ? `${element.content.substring(0, 100)} ...........`
                  : element.content}
              </Text>
            )}
            <Tooltip label={tooltipText}>
              <ActionIcon
                variant="transparent"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  copyToClipboard(element.content);
                }}
              >
                <IconCopy size={ICON_SIZE} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>
      </td>
    </tr>
  ));

  return (
    <>
      <ActionIcon
        onClick={() => {
          refreshChatHistory();
          open();
        }}
        variant="filled"
        color="indigo"
        size="lg"
        sx={{ borderRadius: "50%" }}
      >
        <IconBrandHipchat size={ICON_SIZE} />
      </ActionIcon>
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
