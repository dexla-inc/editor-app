import { JSONSelector } from "@/components/JSONSelector";
import { listVariables } from "@/requests/variables/queries";
import { ICON_SIZE } from "@/utils/config";
import {
  Accordion,
  ActionIcon,
  Card,
  Group,
  Loader,
  Popover,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconDatabase } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

type Props = {
  onSelectValue?: (value: any) => void;
};

export const VariablePicker = (props: Props) => {
  const [showVariablePicker, variablePicker] = useDisclosure(false);
  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const { data: variables, isLoading } = useQuery({
    queryKey: ["variables", projectId, pageId],
    queryFn: async () => {
      return await listVariables(projectId, { pageId });
    },
    enabled: !!projectId && !!pageId,
  });

  console.log({ variables });

  function isStringifiedObject(str: any) {
    try {
      const parsed = JSON.parse(str);
      return (
        parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      );
    } catch (e) {
      return false;
    }
  }

  return (
    <Popover
      position="left"
      withArrow
      shadow="md"
      withinPortal
      opened={showVariablePicker}
      onChange={(isOpen) => {
        if (isOpen) {
          variablePicker.open();
        } else {
          variablePicker.close();
        }
      }}
      radius="md"
    >
      <Popover.Target>
        {isLoading ? (
          <Loader size="xs" />
        ) : (
          <ActionIcon onClick={variablePicker.open} size="xs">
            <IconDatabase size={ICON_SIZE} />
          </ActionIcon>
        )}
      </Popover.Target>
      <Popover.Dropdown p={0} miw={300}>
        <Accordion chevronPosition="left" styles={{ content: { padding: 0 } }}>
          {variables?.results.map((variable) => {
            if (variable.type !== "OBJECT") {
              return (
                <Card key={variable.id} p="xs">
                  <Group noWrap>
                    <ActionIcon
                      onClick={() => {
                        props.onSelectValue?.(`var_${variable.id}`);
                        variablePicker.close();
                      }}
                    >
                      <IconCheck size={ICON_SIZE} />
                    </ActionIcon>
                    <Text size="xs">{variable.name}</Text>
                  </Group>
                </Card>
              );
            }

            const revisedValue = JSON.parse(
              variable.value ?? variable.defaultValue ?? "{}",
            );

            console.log({ revisedValue, variable });

            return (
              <Accordion.Item key={variable.id} value={variable.id}>
                <Accordion.Control>
                  <Text size="xs">{variable.name}</Text>
                </Accordion.Control>
                <Accordion.Panel p={0}>
                  <ScrollArea h={250} p="xs">
                    <JSONSelector
                      data={revisedValue}
                      onSelectValue={(selected) => {
                        props.onSelectValue?.(
                          `var_${JSON.stringify({
                            id: variable.id,
                            path: selected.path,
                          })}`,
                        );
                        variablePicker.close();
                      }}
                    />
                  </ScrollArea>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Popover.Dropdown>
    </Popover>
  );
};
