import { ExtendedUserTheme } from "@/requests/themes/types";
import { createUserThemeColors } from "@/utils/branding";
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
import { useEffect, useRef, useState } from "react";
import { SegmentedControlInput } from "./SegmentedControlInput";

type ColorFamily = ExtendedUserTheme["colorFamilies"][0];

type Props = {
  onValueChange: (value: ColorFamily, index: number) => void;
  colorFamily: ColorFamily;
  index: number;
  deleteFamily?: () => void;
  size?: number;
};

const hexToHexa = (fetchedHex: string) =>
  fetchedHex.length === 7 ? fetchedHex + "ff" : fetchedHex;

export const ColorSelector = ({
  onValueChange,
  deleteFamily,
  size,
  colorFamily,
  index,
}: Props) => {
  const {
    hex: fetchedHex = "",
    name: fetchedName = "",
    isDefault,
  } = colorFamily.colors[6] ?? {};
  const [defaultFamilyName] = fetchedName.split(".");
  const [hexa, setHexa] = useState(hexToHexa(fetchedHex));
  const [newColors, setNewColors] = useState(colorFamily.colors);
  const [opened, { toggle, close }] = useDisclosure(false);
  const [isShadesMain, { open: switchToMain, close: switchToShades }] =
    useDisclosure(true);
  const ref = useClickOutside(() => {
    close();
    switchToMain();
  });

  const [friendlyName, setFriendlyName] = useState(colorFamily.family);

  const onNameChange = (name: string) => {
    setNewColors((prev) =>
      prev.map((c, i) => ({
        ...c,
        name: isDefault ? `${defaultFamilyName}.${i}` : `${name}.${i}`,
        friendlyName: `${name}.${i}`,
      })),
    );
  };

  const onHexaChange = (hex: string) => {
    setHexa(hex);
    setNewColors((prev) =>
      createUserThemeColors([
        {
          isDefault,
          hex,
          name: isDefault ? defaultFamilyName : friendlyName,
          friendlyName,
          brightness: 0,
        },
      ]),
    );
  };

  const onHexaInputChange = (value: string, onChange: any) => {
    if (value && !value.startsWith("#")) {
      value = `#${value}`;
    }
    // Update the hexa value state only if the input is either empty or starts with a "#"
    if (value === "" || value.startsWith("#")) {
      onChange?.(value);
    }
  };

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  // Create a debounced function using useRef so it's stable and doesn't change on re-renders
  const debouncedOnValueChangeRef = useRef(
    debounce((hex, name, colors) => {
      if (onValueChangeRef.current) {
        onValueChangeRef.current({ family: name, colors }, index);
      }
    }, 100),
  );

  // // Call the current debounced function whenever hexa or friendlyName changes
  useEffect(() => {
    debouncedOnValueChangeRef.current(hexa, friendlyName, newColors);
    // Make sure to cancel the debounced call on effect cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => debouncedOnValueChangeRef.current.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hexa, newColors]);

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
        onClose={close}
        position="bottom-start"
      >
        <Popover.Target>
          <Tooltip label={hexa}>
            <ColorSwatch
              ref={ref}
              onClick={toggle}
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
                onChange={onHexaChange}
                onHexaInputChange={onHexaInputChange}
                value={hexa}
                size={size}
              />
            ) : (
              <ShadesList
                onChange={(value) => {
                  setNewColors(value);
                  setHexa(value[6].hex);
                }}
                onHexaInputChange={onHexaInputChange}
                size={size}
                shades={newColors}
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
            onChange={(event) => setFriendlyName(event.target.value)}
            onBlur={(event) => onNameChange(friendlyName)}
            rightSection={
              !isDefault && (
                <ActionIcon onClick={deleteFamily} color="gray">
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
  onChange: any;
  onHexaInputChange: (value: string, onChange: any) => void;
};
function ShadePicker({
  value,
  size,
  onChange,
  onHexaInputChange,
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
          onHexaInputChange(e.currentTarget.value, onChange);
        }}
      />
    </Stack>
  );
}

function ShadesList({
  size,
  onChange,
  shades,
  onHexaInputChange,
}: Omit<ShadePickerProps, "value" | "onChange"> & {
  shades: ColorFamily["colors"];
  onChange: (value: ColorFamily["colors"]) => void;
}) {
  return (
    <Stack>
      {shades.map((shade, index) => (
        <ShadePopover
          key={index}
          value={shade.hex}
          size={size}
          onChange={(value) => {
            const updatedShades = [...shades];
            updatedShades[index].hex = value;
            onChange(updatedShades);
          }}
          onHexaInputChange={onHexaInputChange}
          index={index}
        />
      ))}
    </Stack>
  );
}

function ShadePopover({
  value = "#00000000",
  size,
  onChange,
  index,
  onHexaInputChange,
}: Omit<ShadePickerProps, "onChange"> & {
  index: number;
  onChange: (value: string) => void;
}) {
  const [isPopoverOpen, { toggle: togglePopover, close: closePopover }] =
    useDisclosure(false);
  const shadeRef = useClickOutside(() => closePopover());
  return (
    <Flex align="center" justify="center" gap="xs">
      <Text size="xs" w={20}>
        {index}
      </Text>
      <Flex align="center" justify="center">
        <Popover
          zIndex="20"
          opened={isPopoverOpen}
          onClose={closePopover}
          withArrow
        >
          <Popover.Target>
            <ColorSwatch
              ref={shadeRef}
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
              onClick={togglePopover}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <ShadePicker
              value={value}
              size={size}
              onChange={onChange}
              onHexaInputChange={onHexaInputChange}
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
            onHexaInputChange(e.currentTarget.value, onChange);
          }}
        />
      </Flex>
    </Flex>
  );
}
