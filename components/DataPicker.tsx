import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Popover, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDatabase } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type Props = {
  data?: any;
  onSelectValue?: (value: any) => void;
};

export const DataPicker = (props: Props) => {
  const [ReactJson, setReactJson] = useState();
  const [showJsonPicker, jsonPicker] = useDisclosure(false);

  useEffect(() => {
    // we need to dynamicaly import it as it doesn't support SSR
    const loadJsonViewer = async () => {
      const ReactJsonView = await import("react-json-view");
      setReactJson(ReactJsonView as any);
    };

    loadJsonViewer();
  }, []);

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
      <Popover.Dropdown>
        <ScrollArea h={250}>
          {ReactJson && (
            // @ts-ignore
            <ReactJson.default
              iconStyle="triangle"
              enableClipboard={false}
              displayDataTypes={false}
              quotesOnKeys={false}
              collapseStringsAfterLength={10}
              src={props.data ?? {}}
              onSelect={(selected: any) => {
                props.onSelectValue?.(
                  `${selected.namespace.reduce(
                    (acc: string, item: string, index: number) => {
                      return `${acc}${
                        item === "0"
                          ? "[0]"
                          : index === 0
                          ? `${item}`
                          : `.${item}`
                      }`;
                    },
                    ""
                  )}.${selected.name}`
                );
                jsonPicker.close();
              }}
            />
          )}
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  );
};
