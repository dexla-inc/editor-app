import { useEditorStore } from "@/stores/editor";
import {
  Box,
  ColorSwatch,
  Group,
  Paper,
  Select,
  SelectProps,
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
  }
);

type SelectedColorProps = {
  color: any;
};

const SelectedColor: React.FC<SelectedColorProps> = ({ color }) => (
  <Paper p="xs" bg={color} />
);

export const ThemeColorSelector = (props: Omit<SelectProps, "data">) => {
  const theme = useEditorStore((state) => state.theme);
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

  const data: any[] = (Object.keys(theme.colors) ?? [])
    .filter((color) => !excludeColors.has(color))
    .reduce((all, color: string) => {
      const colors = theme.colors[color];

      return all.concat(
        // @ts-ignore
        colors.map((_, index) => {
          return {
            label: `${color}-${index}`,
            value: `${color}.${index}`,
          };
        })
      );
    }, []);

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
      <Paper p="xs" bg={theme.colors[selectedColor][selectedIndex]} />
    );

  return (
    <Select
      size="xs"
      {...props}
      data={data.concat({
        label: "transparent",
        value: "transparent",
      })}
      itemComponent={SelectItem}
      searchable
      icon={bgColor}
    />
  );
};
