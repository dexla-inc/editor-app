import { JSONSelector } from "@/components/JSONSelector";
import { Accordion, Button, ScrollArea, Text } from "@mantine/core";

export function ObjectDetails({
  variables,
  onItemSelection,
  filterKeyword = "",
}: any) {
  return (
    <Accordion chevronPosition="right">
      {variables
        .filter((variable: any) => {
          return filterKeyword === "" || variable.name.includes(filterKeyword);
        })
        .map((variable: any) => {
          if (variable.type !== "OBJECT") {
            return (
              <Button
                key={variable.id}
                onClick={() => {
                  onItemSelection(`${variable.id}`);
                }}
                variant="default"
              >
                {variable.name}
              </Button>
            );
          }

          return (
            <Accordion.Item key={variable.id} value={variable.id}>
              <Accordion.Control>
                <Text size="xs">{variable.name}</Text>
              </Accordion.Control>
              <Accordion.Panel p={0}>
                <ScrollArea h={250} p={0}>
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
