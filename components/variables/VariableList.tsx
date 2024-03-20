import { VariableForm } from "@/components/variables/VariableForm";
import { deleteVariable } from "@/requests/variables/mutations";
import { useVariableStore } from "@/stores/variables";
import { isObjectOrArray } from "@/utils/common";
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

  const deleteVar = async (variableId: string) => {
    await deleteVariable(projectId, variableId);
  };

  const rows = (
    variableList?.sort((a, b) => a.name.localeCompare(b.name)) ?? []
  )?.map((variable: any) => {
    const defaultValue = variable.defaultValue;
    const value = variable.value;

    return (
      <tr key={variable.id}>
        <td style={{ maxWidth: 150 }}>
          <Text truncate>{variable.name}</Text>
        </td>
        <td style={{ maxWidth: 100 }}>{variable.type}</td>
        <td style={{ maxWidth: 100 }}>{variable.isGlobal.toString()}</td>
        <td style={{ maxWidth: 200 }}>
          <Text truncate>{defaultValue}</Text>
        </td>
        <td style={{ maxWidth: 200 }}>
          <Text truncate>
            {isObjectOrArray(value) ? JSON.stringify(value) : value}
          </Text>
        </td>
        <td style={{ maxWidth: 50 }}>
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
            <ActionIcon size="xs" onClick={() => deleteVar(variable.id)}>
              <IconX />
            </ActionIcon>
          </Group>
        </td>
      </tr>
    );
  });

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
          <Table striped highlightOnHover withBorder withColumnBorders>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Is Global</th>
                <th>Default Value</th>
                <th>Current Value</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
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
