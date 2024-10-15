import { OpenThemeButton } from "@/components/OpenThemeButton";
import { TopLabel } from "@/components/TopLabel";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { getColorLabels } from "@/utils/branding";
import {
  Box,
  ColorSwatch,
  Divider,
  Group,
  Paper,
  Select,
  SelectItem,
  SelectProps,
  Stack,
} from "@mantine/core";
import { forwardRef, useMemo } from "react";

type ColorsArray = Array<{ label: string; value: string | null | undefined }>;

// eslint-disable-next-line react/display-name
const SelectItemComponent = forwardRef<HTMLDivElement, any>(
  ({ value, label, ...other }: any, ref) => {
    const theme = useThemeStore((state) => state.theme);

    if (value === "transparent") {
      return (
        <Group ref={ref} noWrap align="center" spacing={8} {...other}>
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
      <Group ref={ref} noWrap align="center" spacing={8} {...other}>
        <Box w={10} h={10} bg={theme.colors[color][index]} />
        {label}
      </Group>
    );
  },
);

// Create me a type called Props that extends Omit<SelectProps, "data"> on the line below
type Props = {
  excludeTransparent?: boolean;
  isGradient?: boolean;
} & Omit<SelectProps, "data">;

export const ThemeColorSelector = ({ isGradient, ...props }: Props) => {
  const theme = useThemeStore((state) => state.theme);
  const projectId = useEditorTreeStore((state) => state.currentProjectId);
  const projectBranding = useProjectQuery(projectId).data?.branding;
  const colorLabels = useMemo(
    () => getColorLabels(projectBranding),
    [projectBranding],
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
    const lastDotIndex = props.value.lastIndexOf(".");
    const color = props.value.slice(0, lastDotIndex);
    const index = props.value.slice(lastDotIndex + 1);
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

  const { label, ...selectProps } = props;

  const data: ColorsArray = (Object.keys(theme.colors) ?? [])
    .filter((color) => !excludeColors.has(color))
    .reduce<ColorsArray>((all, color: string) => {
      const isColorIndexNotSame =
        selectedColor === color && selectedIndex !== 6;
      const colorValue = isColorIndexNotSame ? selectProps.value : `${color}.6`;
      const _data = [{ label: colorLabels[color] ?? color, value: colorValue }];

      return all.concat(_data);
    }, []);

  const colors = theme.colors[selectedColor];
  const _dataWithShades = colors?.map((_, index) => ({
    label: `${index}`,
    value: `${selectedColor}.${index}`,
  }));

  return (
    <Stack spacing={5}>
      <Stack spacing={0}>
        <TopLabel text={label as string} />
        <Group noWrap spacing={2} align="center">
          <Select
            w="100%"
            size="xs"
            {...selectProps}
            data={
              (props.excludeTransparent
                ? data
                : data.concat({
                    label: "transparent",
                    value: "transparent",
                  })) as SelectItem[]
            }
            itemComponent={SelectItemComponent}
            searchable
            icon={bgColor}
          />
          {selectProps.value !== "transparent" && _dataWithShades && (
            <Group w="35%" spacing={2} noWrap>
              <Divider w={20} color="gray" />
              <Select
                size="xs"
                {...selectProps}
                data={_dataWithShades}
                itemComponent={SelectItemComponent}
                searchable
              />
            </Group>
          )}
        </Group>
      </Stack>
      {!isGradient && <OpenThemeButton />}
    </Stack>
  );
};
