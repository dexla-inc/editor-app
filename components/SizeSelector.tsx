import {
  Box,
  MantineSize,
  Select,
  SelectItem,
  SelectProps,
  Text,
} from "@mantine/core";
import { useMemo } from "react";

interface CustomSelectItemProps {
  label: string;
  description: string;
}

const CustomSelectItem: React.FC<CustomSelectItemProps> = ({
  label,
  description,
  ...others
}) => (
  <Box {...others}>
    <Text>{label}</Text>
    <Text size="xs" color="#ddd">
      {description}
    </Text>
  </Box>
);

const mantineSizes = [
  { label: "Extra Small", value: "xs", description: "" },
  { label: "Small", value: "sm", description: "" },
  { label: "Medium", value: "md", description: "" },
  { label: "Large", value: "lg", description: "" },
  { label: "Extra Large", value: "xl", description: "" },
];

type Props = {
  showNone?: boolean;
  showFullscreen?: boolean;
  data?: Array<{ label: string; value: string }>;
  sizing?: Record<MantineSize, string>;
} & Omit<SelectProps, "data">;

export const SizeSelector = ({
  showNone = true,
  showFullscreen = false,
  label = "Size",
  sizing,
  ...props
}: Props) => {
  const defaultData = useMemo(() => {
    let newData = [...mantineSizes] as SelectItem[];

    if (showFullscreen) {
      newData.push({
        label: "Fullscreen",
        value: "fullscreen",
        description: sizing ? "Full screen" : "",
      });
    }

    if (showNone) {
      newData.push({
        label: "None",
        value: "0",
        description: sizing ? "0px" : "",
      });
    }

    if (sizing) {
      const sizingItems = Object.entries(sizing).map(([size, description]) => ({
        label: size.toUpperCase(),
        value: size,
        description: description,
      }));
      newData = newData.concat(sizingItems);
    }

    return newData;
  }, [showNone, showFullscreen, sizing]);

  return (
    <Select
      label={label}
      size="xs"
      {...props}
      data={defaultData}
      itemComponent={CustomSelectItem}
    />
  );
};
