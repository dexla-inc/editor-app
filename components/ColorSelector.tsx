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
  Tooltip,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";

type Props = {
  friendlyName?: string;
  hex?: string;
  isDefault: boolean;
  onValueChange?: (value: { friendlyName: string; hex: string }) => void;
  mantineTheme: MantineTheme;
  deleteColor?: () => void;
};

export const ColorSelector = ({
  hex: fetchedHex = "",
  friendlyName: fetchedFriendlyName = "",
  isDefault,
  onValueChange,
  mantineTheme,
  deleteColor,
}: Props) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendlyName, hex]);

  useEffect(() => {
    setHex(fetchedHex);
    setFriendlyName(fetchedFriendlyName);
  }, [fetchedHex, fetchedFriendlyName]);

  return (
    <Flex align="center">
      <Popover withArrow zIndex="20">
        <Popover.Target>
          <Tooltip label="Click to change color">
            <ColorSwatch
              color={hex}
              size={36}
              radius="0px"
              withShadow={false}
              style={{
                flex: "none",
                border: "1px solid " + mantineTheme.colors.gray[4],
                borderTopLeftRadius: mantineTheme.radius.sm,
                borderBottomLeftRadius: mantineTheme.radius.sm,
                borderRight: "0px",
              }}
            />
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker format="hex" value={hex} onChange={debouncedHex} />
          <Input value={hex} mt="sm" onChange={(e) => setHex(e.target.value)} />
        </Popover.Dropdown>
        <Tooltip label="Click to edit name">
          <TextInput
            style={{ width: "100%", borderLeft: "0px" }}
            radius="0px 4px 4px 0px"
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
        </Tooltip>
      </Popover>
    </Flex>
  );
};
