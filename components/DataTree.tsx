import { JSONSelector } from "@/components/JSONSelector";
import { Button, ScrollArea, Stack } from "@mantine/core";

export function DataTree({
  variables,
  onItemSelection,
  filterKeyword = "",
}: any) {
  return (
    <ScrollArea.Autosize mah={300}>
      <Stack align="flex-start" spacing="xs">
        {variables
          .filter((variable: any) => {
            return (
              filterKeyword === "" || variable.name.includes(filterKeyword)
            );
          })
          .map((variable: any) => {
            if (variable.type !== "OBJECT") {
              return (
                <Button
                  key={variable.id}
                  onClick={() => {
                    onItemSelection(`${variable.id}`);
                  }}
                >
                  {variable.name}
                </Button>
              );
            }

            return (
              <JSONSelector
                key={variable.id}
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
            );
          })}
      </Stack>
    </ScrollArea.Autosize>
  );
}
