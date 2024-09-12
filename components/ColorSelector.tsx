import { getUserThemeColors } from "@/hooks/editor/useUserTheme";
import { ThemeResponse } from "@/requests/themes/types";
import { LARGE_ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  ColorPicker,
  ColorSwatch,
  Flex,
  Input,
  Popover,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { SegmentedControlInput } from "./SegmentedControlInput";

type ListProps = {
  onValueChange: (value: ThemeResponse["colorShades"]) => void;
  deleteShades: () => void;
  colors: ThemeResponse["colorShades"];
};

interface Props extends ListProps {
  size?: number;
}

export const ColorSelector = ({
  onValueChange,
  deleteShades: deleteColor,
  size,
  colors,
}: Props) => {
  const {
    hex: fetchedHex = "",
    name: fetchedName = "",
    friendlyName: fetchedFriendlyName = "",
    isDefault,
  } = colors[6] ?? colors[0] ?? {};

  const [hexa, setHexa] = useState<string>("");
  const [friendlyName, setFriendlyName] = useState<string>("");
  const index = useRef<number>(0);
  const [opened, setOpened] = useState(false);
  const [isShadesMain, { open: switchToMain, close: switchToShades }] =
    useDisclosure(true);
  const ref = useClickOutside(() => {
    setOpened(false);
    switchToMain();
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((nextValue) => {
      setFriendlyName(nextValue);
    }, 10),
    [debounce],
  );

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  // Create a debounced function using useRef so it's stable and doesn't change on re-renders
  const debouncedOnValueChangeRef = useRef(
    debounce((hex, name) => {
      if (onValueChangeRef.current) {
        const newColor = {
          isDefault,
          friendlyName: `${name}.${index.current}`,
          hex,
          name: isDefault ? fetchedName : `${name}.${index.current}`,
        };
        let newColors = colors;
        if (newColors.length <= 1) {
          onValueChangeRef.current(
            getUserThemeColors([
              { isDefault, hex, name, friendlyName: name, brightness: 0 },
            ]),
          );
        }
        newColors[index.current] = newColor;
        onValueChangeRef.current(newColors);
      }
    }, 100),
  );

  // Call the current debounced function whenever hexa or friendlyName changes
  useEffect(() => {
    debouncedOnValueChangeRef.current(hexa, friendlyName);
    // Make sure to cancel the debounced call on effect cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => debouncedOnValueChangeRef.current.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hexa, friendlyName]);

  useEffect(() => {
    const hexToHexa = fetchedHex.length === 7 ? fetchedHex + "ff" : fetchedHex;
    const [friendlyName, i] = fetchedFriendlyName.split(".");

    setHexa(hexToHexa);
    setFriendlyName(friendlyName);
    index.current = Number(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedHex, fetchedFriendlyName]);

  // TODO: deleting because of 16 times handleKeyDown was triggered - find another solution
  // useEffect(() => {
  //   const handleKeyDown = (event: any) => {
  //     if (event.key === "Escape") {
  //       setOpened(false);
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [opened]);

  return (
    <Flex align="center" ref={ref}>
      <Popover
        width="100%"
        withArrow
        zIndex="20"
        opened={opened}
        onChange={setOpened}
        position="bottom-start"
      >
        <Popover.Target>
          <Tooltip label={hexa}>
            <ColorSwatch
              ref={ref}
              onClick={() => setOpened(!opened)}
              color={hexa}
              size={size ? size : 36}
              radius="0px"
              withShadow={false}
              sx={(theme) => ({
                flex: "none",
                borderTopLeftRadius: theme.radius.sm,
                borderBottomLeftRadius: theme.radius.sm,
                borderRight: "0px",
              })}
            />
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack spacing="xs">
            <SegmentedControlInput
              value={isShadesMain ? "main" : "shades"}
              data={[
                {
                  label: "main",
                  value: "main",
                },
                {
                  label: "shades",
                  value: "shades",
                },
              ]}
              onChange={isShadesMain ? switchToShades : switchToMain}
            />
            {isShadesMain ? (
              <ShadePicker
                onChange={setHexa}
                isShadesMain={isShadesMain}
                value={hexa}
                size={size}
              />
            ) : (
              <ShadesList
                onChange={setHexa}
                isShadesMain={isShadesMain}
                value={hexa}
                size={size}
                shades={colors}
              />
            )}
          </Stack>
        </Popover.Dropdown>
        <Tooltip label="Click to edit name">
          <TextInput
            size={size ? "xs" : "sm"}
            style={{ width: "100%", borderLeft: "0px" }}
            radius="0px 4px 4px 0px"
            value={friendlyName}
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

type ShadePickerProps = {
  value?: string;
  size?: number;
  onChange?: (value: string) => void;
  isShadesMain: boolean;
};
function ShadePicker({
  value,
  size,
  onChange,
  isShadesMain,
}: ShadePickerProps) {
  return (
    <Stack>
      <ColorPicker format="hexa" value={value} onChange={onChange} />
      <Input
        size={size ? "xs" : "sm"}
        value={value}
        mt="sm"
        placeholder="#FFFFFF"
        onChange={(e) => {
          let _value = e.target.value;
          if (_value && !_value.startsWith("#")) {
            _value = `#${_value}`;
          }
          // Update the hexa value state only if the input is either empty or starts with a "#"
          if (_value === "" || _value.startsWith("#")) {
            onChange?.(_value);
          }
        }}
      />
    </Stack>
  );
}

function ShadesList({
  value,
  size,
  onChange,
  isShadesMain,
  shades,
}: ShadePickerProps & { shades: any[] }) {
  return (
    <Stack>
      {shades.map((shade, index) => (
        <ShadePopover
          key={shade.hex}
          value={shade.hex}
          size={size}
          onChange={onChange}
          isShadesMain={isShadesMain}
          index={index + 1}
        />
      ))}
    </Stack>
  );
}

function ShadePopover({
  value = "#00000000",
  size,
  onChange,
  isShadesMain,
  index,
}: ShadePickerProps & { index: number }) {
  return (
    <Flex align="center" justify="center" gap="xs">
      <Text size="xs">{index}</Text>
      <Popover withArrow>
        <Popover.Target>
          <ColorSwatch
            color={value}
            size={size ? size : 36}
            radius="0px"
            withShadow={false}
            sx={(theme) => ({
              flex: "none",
              borderTopLeftRadius: theme.radius.sm,
              borderBottomLeftRadius: theme.radius.sm,
              borderRight: "0px",
            })}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <ShadePicker
            value={value}
            size={size}
            onChange={onChange}
            isShadesMain={isShadesMain}
          />
        </Popover.Dropdown>
      </Popover>
      <TextInput
        size={size ? "xs" : "sm"}
        style={{ width: "100%", borderLeft: "0px" }}
        radius="0px 4px 4px 0px"
        value={value}
        placeholder="#FFFFFF"
        onChange={(e) => {
          let _value = e.target.value;
          if (_value && !_value.startsWith("#")) {
            _value = `#${_value}`;
          }
          // Update the hexa value state only if the input is either empty or starts with a "#"
          if (_value === "" || _value.startsWith("#")) {
            onChange?.(_value);
          }
        }}
      />
    </Flex>
  );
}
