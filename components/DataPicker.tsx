import { JSONSelector } from "@/components/JSONSelector";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Popover, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDatabase } from "@tabler/icons-react";

type Props = {
  data?: any;
  onSelectValue?: (value: any) => void;
};

export const DataPicker = (props: Props) => {
  const [showJsonPicker, jsonPicker] = useDisclosure(false);

  return (
    <Popover
      position="top"
      withArrow
      shadow="md"
      withinPortal
      opened={showJsonPicker}
      onChange={(isOpen) => {
        if (isOpen) {
          jsonPicker.open();
        } else {
          jsonPicker.close();
        }
      }}
      radius="md"
    >
      <Popover.Target>
        <ActionIcon onClick={jsonPicker.open} size="xs">
          <IconDatabase size={ICON_SIZE} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown miw={300}>
        <ScrollArea h={250}>
          <JSONSelector
            data={props.data ?? {}}
            onSelectValue={(selected) => {
              props.onSelectValue?.(selected.path);
              jsonPicker.close();
            }}
            name="data"
          />
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  );
};
