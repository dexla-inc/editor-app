import { TopLabel } from "@/components/TopLabel";
import { DARK_COLOR } from "@/utils/branding";
import {
  ActionIcon,
  Box,
  CloseButton,
  ColorPicker,
  Divider,
  Flex,
  Group,
  Input,
  Paper,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NuAnglePicker } from "react-nu-anglepicker";

type GradientPickerProps = {
  getValue: any;
  setFieldValue: any;
};

function getRandomInt(): number {
  const min = Math.ceil(0);
  const max = Math.floor(100);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseGradientDetailed(gradient: string) {
  // Default result in case of no match
  const defaultResult = { type: "", angle: "", colors: [] };

  // Extract the gradient type, angle, and the colors part
  const matchResult = gradient.match(/([\w-]+)\((.+)\)/);
  if (!matchResult) return defaultResult;

  // Separate the angle and the colors part
  const [type, params] = matchResult.slice(1);
  const [angleWithUnit, ...colorsParts] = params.split(/,\s*/);

  // Remove 'deg' from angle and '%' from color stops
  const angle = angleWithUnit.replace(/deg/, "");

  // Split the colors part and map to an array of color objects
  const colors = colorsParts.map((colorStop) => {
    const [color, stopWithUnit] = colorStop.trim().split(/\s+/);
    const stop = stopWithUnit.replace(/%/, "");
    return { color, stop };
  });

  return { type, angle, colors };
}

const ColorItem = ({ color, index, ...rest }: any) => {
  const { handleClick, isSelected, colors, setColors, setIndex } = rest;

  const handleChange = (key: string, value: string) => {
    const newColors = colors.map((c: any, i: number) =>
      i === index ? { ...c, [key]: value } : c,
    );
    setColors(newColors);
  };

  return (
    <Flex
      sx={(theme) => ({
        background: isSelected ? "gray" : undefined,
        padding: "5px",
        borderRadius: theme.radius.md,
        gap: "5px",
      })}
      align="center"
    >
      <Input
        size="xs"
        fz="xs"
        value={color.color}
        onClick={() => handleClick(index)}
        onChange={(e) => {
          let _value = e.currentTarget.value;
          if (_value && !_value.startsWith("#")) {
            _value = `#${_value}`;
          }
          // Update the hexa value state only if the input is either empty or starts with a "#"
          if (_value === "" || _value.startsWith("#")) {
            handleChange("color", _value);
          }
        }}
      />
      <Input
        size="xs"
        fz="xs"
        w={80}
        value={color.stop}
        onClick={() => handleClick(index)}
        onChange={(e) => {
          let _value = e.target.value;
          if (Number(_value) > 100) _value = "100";
          if (_value && !_value.endsWith("%")) {
            _value = `${_value}%`;
          }
          // Update the hexa value state only if the input is either empty or starts with a "#"
          if (_value === "" || _value.endsWith("%")) {
            handleChange("stop", _value.replace(/[^0-9]/g, ""));
          }
        }}
      />
      {colors.length > 2 ? (
        <CloseButton
          onClick={(e) => {
            e.preventDefault();
            isSelected && setIndex(0);
            // Remove the color at the given index
            const newColors = colors.filter((_: any, i: number) => i !== index);
            setColors(newColors);
          }}
          size="xs"
          iconSize="xs"
        />
      ) : null}
    </Flex>
  );
};

const AngleItem = ({ angle, setAngle }: any) => {
  return (
    <Stack>
      <TopLabel text="ANGLE" />
      <Group noWrap>
        <NuAnglePicker
          styles={{ background: DARK_COLOR }}
          value={angle}
          handleValueChange={setAngle}
        />
      </Group>
    </Stack>
  );
};

const GradientSelector = ({ getValue, setFieldValue }: GradientPickerProps) => {
  const { type, angle, colors } = parseGradientDetailed(getValue());
  const angleValue = isNaN(Number(angle)) ? 0 : Number(angle);
  const [index, setIndex] = useState(0);
  const [_colors, setColors] = useState(colors);
  const [_angle, setAngle] = useState(Number(angleValue));
  const [_type, setType] = useState(type);
  const selectedColor = _colors[index ?? 0];

  const handleClick = (index: number) => setIndex(index);

  const addNewColorToColors = () => {
    const newColors = [
      ...colors,
      { color: "#ffffffff", stop: `${getRandomInt()}` },
    ];
    setColors(newColors);
  };

  useEffect(() => {
    const angle = _type === "linear-gradient" ? `${_angle}deg` : `circle`;
    const gradient = `${_type}(${angle}, ${_colors
      .map((c: any) => `${c.color} ${c.stop}%`)
      .join(",")})`;
    setFieldValue("bg", gradient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_colors, _angle, _type]);

  return (
    <Paper shadow="md" p="sm" w={420} sx={{ justifyContent: "left" }}>
      <Box>
        <Paper pos="relative" h={50} mb="md" sx={{ background: getValue() }} />
      </Box>
      <Group noWrap align="flex-start">
        <Stack spacing="lg">
          <ColorPicker
            w={150}
            format="hexa"
            value={selectedColor.color}
            onChange={(color) => {
              const newColors = _colors.map((c: any, i: number) =>
                i === index ? { ...c, color } : c,
              );
              setColors(newColors);
            }}
          />
          <Stack spacing="0">
            <Text fz="xs" color="dimmed" fw="bold">
              COLOR CODE
            </Text>
            <Input
              size="xs"
              value={selectedColor.color}
              placeholder="#FFFFFFFF"
              onChange={(e) => {
                let _value = e.target.value;
                if (_value && !_value.startsWith("#")) {
                  _value = `#${_value}`;
                }
                // Update the hexa value state only if the input is either empty or starts with a "#"
                if (_value === "" || _value.startsWith("#")) {
                  const newColors = _colors.map((c: any, i: number) =>
                    i === index ? { ...c, color: _value } : c,
                  );
                  setColors(newColors);
                }
              }}
            />
          </Stack>
          <SegmentedControl
            size="xs"
            data={[
              { label: "Linear", value: "linear-gradient" },
              { label: "Radial", value: "radial-gradient" },
            ]}
            value={_type}
            onChange={setType}
          />
        </Stack>
        <Divider orientation="vertical" />
        <Stack spacing={50}>
          <Stack>
            <Group sx={{ justifyContent: "space-between" }} noWrap>
              <TopLabel text="GRADIENT COLORS" />
              <ActionIcon
                size="xs"
                onClick={addNewColorToColors}
                disabled={_colors.length >= 4}
              >
                <IconPlus />
              </ActionIcon>
            </Group>
            <Stack spacing="xs">
              {_colors.map((color: any, i) => {
                const isSelected = i === index;
                return (
                  <ColorItem
                    key={i}
                    color={color}
                    index={i}
                    setIndex={setIndex}
                    handleClick={handleClick}
                    isSelected={isSelected}
                    colors={_colors}
                    setColors={setColors}
                  />
                );
              })}
            </Stack>
          </Stack>
          {_type === "linear-gradient" && (
            <AngleItem angle={_angle} setAngle={setAngle} />
          )}
        </Stack>
      </Group>
      <Paper fz="xs" shadow="xl" sx={{ textAlign: "center" }} mt="md" p="md">
        {getValue()}
      </Paper>
    </Paper>
  );
};

export const GradientPicker = ({
  getValue,
  setFieldValue,
}: GradientPickerProps) => {
  const [opened, { toggle }] = useDisclosure(false);

  const gradientSwatch = (
    <Paper
      w={25}
      h={20}
      sx={(theme) => ({
        borderRadius: theme.radius.sm,
        background: getValue(),
      })}
    />
  );
  return (
    <Stack spacing={0}>
      <TopLabel text="Gradient" />
      <Popover opened={opened} withinPortal position="left">
        <Popover.Target>
          <TextInput
            onClick={toggle}
            icon={gradientSwatch}
            readOnly
            value={getValue()}
          />
        </Popover.Target>
        <Popover.Dropdown p={0}>
          <Box>
            <GradientSelector
              getValue={getValue}
              setFieldValue={setFieldValue}
            />
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Stack>
  );
};
