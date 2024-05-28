import { ActionIconDefault } from "@/components/ActionIconDefault";
import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { useAutomationsQuery } from "@/hooks/editor/reactQuery/useAutomationsQuery";
import { LARGE_ICON_SIZE } from "@/utils/config";
import TOML from "@iarna/toml";
import {
  Badge,
  Box,
  Collapse,
  Flex,
  Modal,
  Stack,
  Table,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Prism } from "@mantine/prism";
import { IconJson, IconToml } from "@tabler/icons-react";
import { memo, useState } from "react";

type Props = {
  projectId: string;
  pageTitle?: string | undefined;
};

type ContentOpenedType = { [id: string]: boolean };

export const AIChatHistoryButtonComponent = ({ projectId }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [contentOpened, setContentOpened] = useState<ContentOpenedType>({});
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");

  const { data: chatHistoryList, refetch } = useAutomationsQuery(
    projectId,
    opened,
  );

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

  const rows = chatHistoryList?.results.map((element) => (
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
            <ActionIconDefault
              iconName="IconCopy"
              tooltip={tooltipText}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                copyToClipboard(element.content);
              }}
            />
          </Flex>
        </Box>
      </td>
    </tr>
  ));

  return (
    <>
      <ActionIconDefault
        iconName="IconHistory"
        tooltip="AI History"
        onClick={() => {
          refetch();
          open();
        }}
        color="indigo"
      />
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

export const AIChatHistoryButton = memo(AIChatHistoryButtonComponent);
