import { OpenThemeButton } from "@/components/OpenThemeButton";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import {
  ActionIcon,
  Avatar,
  Box,
  ColorSwatch,
  Group,
  Paper,
  Select,
  SelectProps,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, any>(
  ({ value, label, ...other }: any, ref) => {
    const theme = useEditorStore((state) => state.theme);

    if (value === "transparent") {
      return (
        <Group ref={ref} noWrap {...other}>
          {/* <Box w={10} h={10} bg="transparent" /> */}
          <ColorSwatch
            radius="xs"
            size={10}
            color={theme.fn.rgba(theme.colors.gray[3], 0.2)}
          />
          {label}
        </Group>
      );
    }

    const [color, index] = value.split(".");

    return (
      <Group ref={ref} noWrap {...other}>
        <Box w={10} h={10} bg={theme.colors[color][index]} />
        {label}
      </Group>
    );
  },
);

type SelectedColorProps = {
  color: any;
};

const SelectedColor: React.FC<SelectedColorProps> = ({ color }) => (
  <Paper p="xs" bg={color} />
);

export const ThemeColorSelector = (props: Omit<SelectProps, "data">) => {
  const theme = useEditorStore((state) => state.theme);
  const isShadesActive = useUserConfigStore((state) => state.isShadesActive);
  const setIsShadesActive = useUserConfigStore(
    (state) => state.setIsShadesActive,
  );
  const excludeColors = new Set([
    "blue",
    "cyan",
    "dark",
    "grape",
    "gray",
    "green",
    "indigo",
    "lime",
    "orange",
    "pink",
    "red",
    "teal",
    "violet",
    "yellow",
  ]);

  let [selectedColor, selectedIndex] = ["Primary", 6]; // default color if none is selected

  // If a color is selected and it's not 'transparent', determine the color
  if (props.value && props.value !== "transparent") {
    const [color, index] = props.value.split(".");
    [selectedColor, selectedIndex] = [color, Number(index)];
  }

  const bgColor =
    props.value && props.value === "transparent" ? (
      <ColorSwatch
        radius="sm"
        size={20}
        color={theme.fn.rgba(theme.colors.gray[3], 0.2)}
      />
    ) : (
      <Paper
        p="xs"
        bg={
          theme && theme.colors && theme.colors[selectedColor]
            ? theme.colors[selectedColor][selectedIndex]
            : "Primary.6"
        }
      />
    );

  const data: any[] = (Object.keys(theme.colors) ?? [])
    .filter((color) => !excludeColors.has(color))
    .reduce((all, color: string) => {
      const colors = theme.colors[color];
      const _dataWithShades = colors.map((_, index) => ({
        label: `${color}-${index}`,
        value: `${color}.${index}`,
      }));
      const _data = isShadesActive
        ? _dataWithShades
        : [{ label: color, value: `${color}.${selectedIndex}` }];

      return all.concat(
        // @ts-ignore
        _data,
      );
    }, []);

  const boxShadow = `0 0 5px 0.625px ${theme.colors.teal[6]}`;
  const { label, ...selectProps } = props;

  return (
    <Stack spacing={5}>
      <Stack spacing={0}>
        <Text fw={500} fz="xs">
          {label}
        </Text>
        <Group noWrap align="center">
          <Select
            w="100%"
            size="xs"
            {...selectProps}
            // value={_value}
            data={data.concat({
              label: "transparent",
              value: "transparent",
            })}
            itemComponent={SelectItem}
            searchable
            icon={bgColor}
          />
          <Tooltip
            withArrow
            withinPortal
            position="left"
            offset={0}
            fz="xs"
            p="2px 4px"
            label={isShadesActive ? "Turn off shades" : "Turn on shades"}
          >
            <ActionIcon onClick={() => setIsShadesActive(!isShadesActive)}>
              <Avatar
                sx={isShadesActive ? { boxShadow } : {}}
                radius="xl"
                size={24}
                src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Color_circle_%28RGB%29.svg"
              />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
      <OpenThemeButton />
    </Stack>
  );
};
