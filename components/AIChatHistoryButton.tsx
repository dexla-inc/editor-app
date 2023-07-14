import { getChatHistoryList } from "@/requests/ai/queries";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Badge, Modal, Stack, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandHipchat } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

type Props = {
  projectId: string;
  pageTitle?: string | undefined;
};

export const AIChatHistoryButton = ({ projectId }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [contentOpened, { open: openContent, close: closeContent }] =
    useDisclosure(false);

  const chatHistoryList = useQuery({
    queryKey: ["chatHistory"],
    queryFn: () => getChatHistoryList(projectId),
  });

  const rows = chatHistoryList.data?.results.map((element) => (
    <tr key={element.id}>
      <td>
        <Badge>{element.role}</Badge>
      </td>
      <td>
        <Badge color="blue">{element.requestType}</Badge>
      </td>
      <td>{new Date(element.created).toLocaleString()}</td>
      <td style={{ whiteSpace: "pre-wrap" }}>{element.content}</td>
      {/* <Button onClick={toggle}>Toggle content</Button>
      <Collapse in={contentOpened}>
        <td style={{ whiteSpace: "pre-wrap" }}>{element.content}</td>
      </Collapse> */}
    </tr>
  ));

  return (
    <>
      <ActionIcon
        onClick={open}
        variant="filled"
        color="indigo"
        size="lg"
        sx={{ borderRadius: "50%" }}
      >
        <IconBrandHipchat size={ICON_SIZE} />
      </ActionIcon>
      <Modal size="70%" opened={opened} onClose={close} title="Chat History">
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
