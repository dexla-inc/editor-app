import { VariableForm } from "@/components/variables/VariableForm";
import { deleteVariable } from "@/requests/variables/mutations";
import { listVariables } from "@/requests/variables/queries-noauth";
import {
  ActionIcon,
  Center,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconEdit, IconSearch, IconX } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

export const VariableList = ({ projectId, pageId }: Props) => {
  const [opened, modal] = useDisclosure(false);
  const [filter, setFilter] = useDebouncedState("", 250);
  const [variableToEdit, setVariableToEdit] = useState(undefined);
  const client = useQueryClient();

  const { data: variables, refetch } = useQuery({
    queryKey: ["variables", projectId, pageId],
    queryFn: async () => {
      const response = await listVariables(
        projectId,
        // @ts-ignore
        {
          search: filter,
          pageId,
        },
      );
      return response;
    },
    enabled: !!projectId && !!pageId,
  });

  const deleteVariableMutation = useMutation({
    mutationKey: ["variables", projectId, pageId],
    mutationFn: async (id: string) => {
      const response = await deleteVariable(projectId, id);
      return response;
    },
    onSettled: () => {
      client.refetchQueries(["variables", projectId, pageId]);
    },
  });

  useEffect(() => {
    refetch();
  }, [filter, refetch]);

  const rows = (variables?.results ?? [])?.map((variable: any) => (
    <tr key={variable.id}>
      <td>{variable.name}</td>
      <td>{variable.type}</td>
      <td>{variable.defaultValue}</td>
      <td>
        <Group>
          <ActionIcon
            size="xs"
            onClick={() => {
              setVariableToEdit(variable.id);
              modal.open();
            }}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon
            size="xs"
            onClick={() => deleteVariableMutation.mutate(variable.id)}
          >
            <IconX />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      <ScrollArea h={300}>
        <TextInput
          placeholder="Search"
          mb="xs"
          icon={<IconSearch size={14} />}
          defaultValue={filter}
          onChange={(event) => {
            setFilter(event.currentTarget.value);
          }}
        />
        {rows.length > 0 && (
          <Stack>
            <Table striped highlightOnHover withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Stack>
        )}
        {!rows.length && (
          <Stack>
            <Center>
              <Text color="dimmed" size="xs">
                No variables here yet
              </Text>
            </Center>
          </Stack>
        )}
      </ScrollArea>
      <Modal title="Edit Variable" opened={opened} onClose={modal.close}>
        <VariableForm projectId={projectId} variableId={variableToEdit} />
      </Modal>
    </>
  );
};
