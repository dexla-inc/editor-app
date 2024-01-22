import { JSONSelector } from "@/components/JSONSelector";
import { Button, ScrollArea, Stack } from "@mantine/core";

type Props = {
  variables: any[];
  onItemSelection: (selected: string) => void;
  filterKeyword?: string;
};

// TODO: This needs refactoring as it currently only really supports variables as we are checking type, value and default value
// This needs to be generic as I want to add support for auth such as access token, refresh token, etc
export function DataTree({
  variables,
  onItemSelection,
  filterKeyword = "",
}: Props) {
  return (
    <ScrollArea.Autosize mah={150}>
      <Stack align="flex-start" spacing="xs">
        {variables
          .filter((variable: any) => {
            const regex = new RegExp(filterKeyword, "i");
            return filterKeyword === "" || regex.test(variable.name);
          })
          .map((variable: any, index: number) => {
            if (variable.type && variable.type !== "OBJECT") {
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
                key={variable.id ?? index}
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
