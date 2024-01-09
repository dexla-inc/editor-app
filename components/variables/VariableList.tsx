import { VariableForm } from "@/components/variables/VariableForm";
import { deleteVariable } from "@/requests/variables/mutations";
import { useVariableStore } from "@/stores/variables";
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
import { useState } from "react";

type Props = {
  projectId: string;
};

export const VariableList = ({ projectId }: Props) => {
  const [opened, modal] = useDisclosure(false);
  const [filter, setFilter] = useDebouncedState("", 250);
  const [variableToEdit, setVariableToEdit] = useState(undefined);
  const variableList = useVariableStore((state) => state.variableList);

  const rows = (variableList ?? [])?.map((variable: any) => (
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
            onClick={async () => await deleteVariable(projectId, variable.id)}
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
        <VariableForm variableId={variableToEdit} />
      </Modal>
    </>
  );
};
