import React from "react";
import {
  Accordion,
  ActionIcon,
  Card,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { JSONSelector } from "@/components/JSONSelector";

export function ObjectDetails({
  variables,
  onItemSelection,
  filterKeyword = "",
}: any) {
  return (
    <Accordion chevronPosition="left" styles={{ content: { padding: 0 } }}>
      {variables
        .filter((variable: any) => {
          return filterKeyword === "" || variable.name.includes(filterKeyword);
        })
        .map((variable: any) => {
          if (variable.type !== "OBJECT") {
            return (
              <Card key={variable.id} p="xs">
                <Group noWrap>
                  <ActionIcon
                    onClick={() => {
                      onItemSelection(`${variable.id}`);
                    }}
                  >
                    <IconCheck size={ICON_SIZE} />
                  </ActionIcon>
                  <Text size="xs">{variable.name}</Text>
                </Group>
              </Card>
            );
          }

          return (
            <Accordion.Item key={variable.id} value={variable.id}>
              <Accordion.Control>
                <Text size="xs">{variable.name}</Text>
              </Accordion.Control>
              <Accordion.Panel p={0}>
                <ScrollArea h={250} p="xs">
                  <JSONSelector
                    data={JSON.parse(
                      variable.value ?? variable.defaultValue ?? "{}",
                    )}
                    onSelectValue={(selected) => {
                      onItemSelection(
                        `${JSON.stringify({
                          id: variable.id,
                          path: selected.path,
                        })}`,
                      );
                    }}
                  />
                </ScrollArea>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
    </Accordion>
  );
}
