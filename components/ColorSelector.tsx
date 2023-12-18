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
import { useClickOutside } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  friendlyName?: string;
  hex?: string;
  isDefault: boolean;
  onValueChange?: (value: { friendlyName: string; hex: string }) => void;
  mantineTheme: MantineTheme;
  deleteColor?: () => void;
  size?: number;
};

export const ColorSelector = ({
  hex: fetchedHex = "",
  friendlyName: fetchedFriendlyName = "",
  isDefault,
  onValueChange,
  mantineTheme,
  deleteColor,
  size,
}: Props) => {
  const [hexa, setHexa] = useState<string>("");
  const [friendlyName, setFriendlyName] = useState<string>("");
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((nextValue) => {
      setFriendlyName(nextValue);
    }, 10000),
    [debounce],
  );

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  // Create a debounced function using useRef so it's stable and doesn't change on re-renders
  const debouncedOnValueChangeRef = useRef(
    debounce((hex, name) => {
      if (onValueChangeRef.current) {
        onValueChangeRef.current({ friendlyName: name, hex });
      }
    }, 100),
  );

  // Call the current debounced function whenever hexa or friendlyName changes
  useEffect(() => {
    debouncedOnValueChangeRef.current(hexa, friendlyName);
    // Make sure to cancel the debounced call on effect cleanup
    return () => debouncedOnValueChangeRef.current.cancel();
  }, [hexa, friendlyName]);

  useEffect(() => {
    const hexToHexa = fetchedHex.length === 7 ? fetchedHex + "ff" : fetchedHex;

    setHexa(hexToHexa);
    setFriendlyName(fetchedFriendlyName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedHex, fetchedFriendlyName]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        setOpened(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [opened]);

  return (
    <Flex align="center" ref={ref}>
      <Popover
        withArrow
        zIndex="20"
        opened={opened}
        onChange={setOpened}
        position="bottom-start"
      >
        <Popover.Target>
          <Tooltip label="Click to change color">
            <ColorSwatch
              ref={ref}
              onClick={() => setOpened(!opened)}
              color={hexa}
              size={size ? size : 36}
              radius="0px"
              withShadow={false}
              style={{
                flex: "none",
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
            size={size ? "xs" : "sm"}
            value={hexa}
            mt="sm"
            placeholder="#FFFFFF"
            onChange={(e) => {
              let _value = e.target.value;
              if (_value && !_value.startsWith("#")) {
                _value = `#${_value}`;
              }
              // Update the hexa value state only if the input is either empty or starts with a "#"
              if (_value === "" || _value.startsWith("#")) {
                setHexa(_value);
              }
            }}
          />
        </Popover.Dropdown>
        <Tooltip label="Click to edit name">
          <TextInput
            size={size ? "xs" : "sm"}
            style={{ width: "100%", borderLeft: "0px" }}
            radius="0px 4px 4px 0px"
            defaultValue={friendlyName}
            onBlur={() => debouncedOnChange.flush()}
            onChange={(event) => debouncedOnChange(event.target.value)}
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
