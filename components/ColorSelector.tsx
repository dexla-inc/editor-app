import { LARGE_ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  ColorPicker,
  ColorSwatch,
  Flex,
  Input,
  MantineTheme,
  Popover,
  TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";

interface ColorSelectorProps {
  friendlyName?: string;
  hex?: string;
  isDefault: boolean;
  onValueChange?: (value: { friendlyName: string; hex: string }) => void;
  mantineTheme: MantineTheme;
  deleteColor?: () => void;
}

export const ColorSelector = ({
  hex: fetchedHex = "",
  friendlyName: fetchedFriendlyName = "",
  isDefault,
  onValueChange,
  mantineTheme,
  deleteColor,
}: ColorSelectorProps) => {
  const [hex, setHex] = useState(fetchedHex);
  const [friendlyName, setFriendlyName] = useState(fetchedFriendlyName);

  const debouncedFriendlyName = debounce(
    (query) => setFriendlyName(query),
    400
  );
  const debouncedHex = debounce((query) => setHex(query), 400);

  useEffect(() => {
    if (onValueChange) {
      onValueChange({ friendlyName, hex });
    }
    console.log("useEffect 1");
  }, [friendlyName, hex]);

  return (
    <Flex align="center" gap="sm">
      <Popover withArrow zIndex="20">
        <Popover.Target>
          <ColorSwatch
            color={hex}
            radius={mantineTheme.radius.xs}
            size={34}
            withShadow={false}
            style={{ flex: "none" }}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker format="hex" value={hex} onChange={debouncedHex} />
          <Input value={hex} mt="sm" />
        </Popover.Dropdown>
        <TextInput
          sx={{ width: "100%" }}
          defaultValue={friendlyName}
          onChange={(event) => debouncedFriendlyName(event.target.value)}
          rightSection={
            !isDefault && (
              <ActionIcon onClick={deleteColor} color="gray">
                <IconX size={LARGE_ICON_SIZE} />
              </ActionIcon>
            )
          }
          rightSectionWidth={40}
        />
      </Popover>
    </Flex>
  );
};
