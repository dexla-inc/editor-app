import { useEditorStore } from "@/stores/editor";
import { Box, Group, Select, SelectProps } from "@mantine/core";
import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, any>(
  ({ value, label, ...other }: any, ref) => {
    const theme = useEditorStore((state) => state.theme);

    if (value === "transparent") {
      return (
        <Group ref={ref} noWrap {...other}>
          <Box w={10} h={10} bg="transparent" />
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

export const ThemeColorSelector = (props: Omit<SelectProps, "data">) => {
  const theme = useEditorStore((state) => state.theme);
  const data: any[] = (Object.keys(theme.colors) ?? []).reduce(
    (all, color: string) => {
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
    },
    []
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
    />
  );
};
