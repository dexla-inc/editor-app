import { TopLabel } from "@/components/TopLabel";
import { useEditorStore } from "@/stores/editor";
import { DARK_COLOR } from "@/utils/branding";
import { getColorFromTheme } from "@/utils/editor";
import {
  ActionIcon,
  Box,
  CloseButton,
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
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { NuAnglePicker } from "react-nu-anglepicker";
import { ThemeColorSelector } from "./ThemeColorSelector";
import { getThemeColor } from "./modifiers/Border";

type GradientPickerProps = {
  getValue: any;
  setFieldValue: any;
};

function getRandomInt(): number {
  const min = Math.ceil(0);
  const max = Math.floor(100);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getColorsAndStops = (params: string) => {
  const colorsPartsRegex = /(?:rgba?\([^)]+\)|#[\dA-Fa-f]+)\s*(\d*%?)/g;
  let match;
  const colors = [];

  while ((match = colorsPartsRegex.exec(params))) {
    let [color, stop] = match;
    if (stop) {
      // If a stop value is provided, separate it from the color value
      color = color.replace(/\s+\d*%?$/, "");
      stop = stop.replace("%", ""); // Remove the '%' sign for consistency
    }
    colors.push({ color, stop });
  }
  return colors;
};

function parseGradientDetailed(gradient: string) {
  // Default result in case of no match
  const defaultResult = { type: "", angle: 0, colors: [] };

  // Extract the gradient type, angle, and the colors part
  const matchResult = gradient.match(/([\w-]+)\((.+)\)/);
  if (!matchResult) return defaultResult;

  // Separate the angle and the colors part
  const [type, params] = matchResult.slice(1);
  const [angleWithUnit, _] = params.split(/,\s*/);

  // Remove 'deg' from angle and '%' from color stops
  let angle = Number(angleWithUnit.replace(/deg/, ""));
  angle = isNaN(angle) ? 0 : angle;

  // Split the colors part and map to an array of color objects
  const colors = getColorsAndStops(params);

  return { type, angle, colors };
}

const ColorItem = ({ color, index, theme, ...rest }: any) => {
  const { onClick, onDelete, isSelected, colors, setColors } = rest;

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
      <ThemeColorSelector
        value={getThemeColor(theme, color.color)}
        isGradient={true}
        onClick={() => onClick(index)}
        onChange={(e) => {
          const _value = getColorFromTheme(theme, e as string);
          handleChange("color", _value);
        }}
      />
      <Input
        size="xs"
        fz="xs"
        w={100}
        value={color.stop}
        onClick={() => onClick(index)}
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
          onClick={() => onDelete(isSelected)}
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
      <NuAnglePicker
        styles={{ background: DARK_COLOR, fontSize: "8px" }}
        value={angle}
        handleValueChange={setAngle}
      />
    </Stack>
  );
};

const GradientSelector = ({ getValue, setFieldValue }: GradientPickerProps) => {
  const theme = useEditorStore((state) => state.theme);

  const form = useForm({
    initialValues: {
      index: 0,
      ...parseGradientDetailed(getValue()),
    },
  });
  const gradValues = form.values;
  const selectedColor = gradValues.colors[gradValues.index];

  const onClick = (index: number) => form.setFieldValue("index", index);

  const onDelete = (isSelected: boolean) => {
    const newIndex = gradValues.index === 0 ? 1 : 0;
    isSelected && onClick(newIndex);
    form.removeListItem("colors", gradValues.index);
  };

  const addNewColorToColors = () => {
    form.insertListItem("colors", {
      color: "#ffffffff",
      stop: `${getRandomInt()}`,
    });
  };

  useEffect(() => {
    if (form.isTouched()) {
      let { type, angle, colors } = gradValues;
      const _angle = type === "linear-gradient" ? `${angle}deg` : `circle`;
      const gradient = `${type}(${_angle}, ${colors
        .map((c: any) => `${c.color} ${c.stop}%`)
        .join(",")})`;
      setFieldValue("bg", gradient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradValues]);

  return (
    <Paper shadow="md" p="sm" w={450} sx={{ justifyContent: "left" }}>
      <Box>
        <Paper pos="relative" h={50} mb="md" sx={{ background: getValue() }} />
      </Box>
      <Group noWrap align="flex-start">
        <Stack spacing="lg">
          <Stack spacing="0" w={120}>
            <Text fz="xs" color="dimmed" fw="bold">
              COLOR CODE
            </Text>
            <Input
              size="xs"
              value={selectedColor.color}
              readOnly
              placeholder="#FFFFFFFF"
            />
          </Stack>
          <SegmentedControl
            size="xs"
            data={[
              { label: "Linear", value: "linear-gradient" },
              { label: "Radial", value: "radial-gradient" },
            ]}
            {...form.getInputProps("type")}
          />
          {gradValues.type === "linear-gradient" && (
            <AngleItem
              angle={form.getInputProps("angle").value}
              setAngle={(value: number) => form.setFieldValue("angle", value)}
            />
          )}
        </Stack>
        <Divider orientation="vertical" />
        <Stack spacing={50}>
          <Stack>
            <Group sx={{ justifyContent: "space-between" }} noWrap>
              <TopLabel text="GRADIENT COLORS" />
              <ActionIcon
                size="xs"
                onClick={addNewColorToColors}
                disabled={gradValues.colors.length >= 4}
              >
                <IconPlus />
              </ActionIcon>
            </Group>
            <Stack spacing="xs">
              {gradValues.colors.map((color: any, i) => {
                const isSelected = i === gradValues.index;
                return (
                  <ColorItem
                    key={i}
                    color={color}
                    index={i}
                    onClick={onClick}
                    onDelete={onDelete}
                    isSelected={isSelected}
                    colors={gradValues.colors}
                    setColors={form.getInputProps("colors").onChange}
                    theme={theme}
                  />
                );
              })}
            </Stack>
          </Stack>
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
            value={getValue()}
            onChange={(e) => setFieldValue("bg", e.target.value)}
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
