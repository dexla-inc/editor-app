import { VariableForm } from "@/components/variables/VariableForm";
import { deleteVariable } from "@/requests/variables/mutations";
import { useVariableStore } from "@/stores/variables";
import { isObjectOrArray } from "@/utils/common";
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconEdit, IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { modals, openContextModal } from "@mantine/modals";

type Props = {
  projectId: string;
  parentModalControl: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  };
};

export const VariableList = ({ projectId, parentModalControl }: Props) => {
  const [opened, modal] = useDisclosure(false);
  const [filter, setFilter] = useDebouncedState("", 100);
  const [variableToEdit, setVariableToEdit] = useState(undefined);
  const variableList = useVariableStore((state) =>
    Object.values(state.variableList),
  );

  const deleteVar = async (variableId: string) => {
    await deleteVariable(projectId, variableId);
  };

  const filteredVariables =
    variableList
      ?.filter((variable) => {
        const searchStr = (filter ?? "").toLowerCase().replace(/_/g, " ");
        const variableNameNormalized = (variable.name ?? "")
          .toLowerCase()
          .replace(/_/g, " ");
        return variableNameNormalized.includes(searchStr);
      })
      .sort((a, b) => {
        const nameA = a.name ?? "";
        const nameB = b.name ?? "";
        return nameA.localeCompare(nameB);
      }) ?? [];

  const rows = filteredVariables.map((variable: any) => {
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
        <td style={{ maxWidth: 90 }}>
          <Group spacing={5} position="center">
            <Tooltip label="Find">
              <ActionIcon
                size="xs"
                onClick={() => {
                  openContextModal({
                    modal: "variableInstanceTracker",
                    title: (
                      <Text weight="bold">{`Variable "${variable.name}" found in`}</Text>
                    ),
                    innerProps: {
                      variableId: variable.id,
                      onClose: parentModalControl.close,
                    },
                  });
                }}
              >
                <IconSearch />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Edit">
              <ActionIcon
                size="xs"
                onClick={() => {
                  setVariableToEdit(variable.id);
                  modal.open();
                }}
              >
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon
                size="xs"
                onClick={() => {
                  modals.openConfirmModal({
                    title: "Delete Variable",
                    centered: true,
                    children: (
                      <Text size="sm">
                        Are you sure you want to delete the variable
                        <b>{` "${variable.name}"`}</b>?
                      </Text>
                    ),
                    labels: {
                      confirm: "Delete variable",
                      cancel: "Cancel",
                    },
                    confirmProps: { color: "red" },
                    onConfirm: () => deleteVar(variable.id),
                  });
                }}
              >
                <IconX />
              </ActionIcon>
            </Tooltip>
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <>
      <TextInput
        placeholder="Search"
        icon={<IconSearch size={14} />}
        defaultValue={filter}
        onChange={(event) => {
          setFilter(event.currentTarget.value);
        }}
      />
      <ScrollArea h={300}>
        {rows.length > 0 && (
          <Table striped highlightOnHover withBorder withColumnBorders>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Is Global</th>
                <th>Default Value</th>
                <th>Current Value</th>
                <th style={{ width: 90 }}>Actions</th>
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
        <VariableForm variableId={variableToEdit} setMode={() => {}} />
      </Modal>
    </>
  );
};
