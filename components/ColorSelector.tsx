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
  const hexToHexa = fetchedHex.length === 7 ? fetchedHex + "ff" : fetchedHex;
  const [hexa, setHexa] = useState(hexToHexa);
  const [friendlyName, setFriendlyName] = useState(fetchedFriendlyName);

  useEffect(() => {
    if (onValueChange) {
      onValueChange({ friendlyName, hex: hexa });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendlyName, hexa]);

  useEffect(() => {
    setHexa(hexa);
    setFriendlyName(fetchedFriendlyName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex align="center">
      <Popover withArrow zIndex="20">
        <Popover.Target>
          <Tooltip label="Click to change color">
            <ColorSwatch
              color={hexa}
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
          <ColorPicker format="hexa" value={hexa} onChange={setHexa} />
          <Input
            value={hexa}
            mt="sm"
            onChange={(e) => setHexa(e.target.value)}
          />
        </Popover.Dropdown>
        <Tooltip label="Click to edit name">
          <TextInput
            style={{ width: "100%", borderLeft: "0px" }}
            radius="0px 4px 4px 0px"
            defaultValue={friendlyName}
            onChange={(event) => setFriendlyName(event.target.value)}
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
