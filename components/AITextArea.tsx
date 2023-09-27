import { useEditorStore } from "@/stores/editor";
import { Flex, Popover, Text, Textarea } from "@mantine/core";
import { useRef, useState } from "react";
import { Icon } from "./Icon";

interface PrefixItem {
  aiPrefix: string;
  icon: string;
}

interface Props {
  items: PrefixItem[];
}

export const AIPrefixTextarea = ({ items }: Props) => {
  const [value, setValue] = useState<string>("");
  const [showPrefix, setShowPrefix] = useState<boolean>(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const theme = useEditorStore((state) => state.theme);

  const filteredItems = items.filter((item) =>
    item.aiPrefix.toLowerCase().includes(value.toLowerCase()),
  );

  const handleInputChange = (inputValue: string) => {
    setValue(inputValue);

    // Find if the inputValue matches any aiPrefix (case-insensitive)
    const exactMatch = items.find(
      (item) => item.aiPrefix.toLowerCase() === inputValue.toLowerCase(),
    );

    // If an exact match is found, update the inputValue to match the exact case from items
    if (exactMatch) {
      setValue(exactMatch.aiPrefix);
      return;
    }

    // Show the popover if there are filtered items or if the Textarea is empty
    setShowPrefix(filteredItems.length > 0 || inputValue.trim() === "");
  };

  return (
    <Popover
      opened={showPrefix}
      position="bottom"
      width={250}
      onClose={() => setShowPrefix(false)}
    >
      <Popover.Target>
        <Textarea
          ref={ref}
          value={value}
          onFocus={() => setShowPrefix(true)}
          onBlur={() => {
            if (value.trim() !== "") {
              setShowPrefix(false);
            }
          }}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </Popover.Target>
      {showPrefix && ref.current && (
        <Popover.Dropdown p={0}>
          {filteredItems.map((item, index) => (
            <Flex
              key={index}
              p="xs"
              gap={6}
              align="center"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.colors.gray[1],
                },
              }}
              onMouseDown={() => {
                setValue(`${item.aiPrefix} `);
                setShowPrefix(false);
              }}
            >
              <Icon name={item.icon} style={{ color: theme.colors.teal[6] }} />
              <Text>{item.aiPrefix}</Text>
            </Flex>
          ))}
        </Popover.Dropdown>
      )}
    </Popover>
  );
};
