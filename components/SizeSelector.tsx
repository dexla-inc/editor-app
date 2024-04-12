import { gapSizes, inputSizes } from "@/utils/defaultSizes";
import {
  Box,
  MantineSize,
  Select,
  SelectItem,
  SelectProps,
  Text,
} from "@mantine/core";

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
  let defaultData = [] as SelectItem[];
  if (!sizing) {
    defaultData = mantineSizes;
  }

  if (showNone && sizing) {
    defaultData.push({ label: "None", value: "0", description: "0px" });
  } else if (showNone) {
    defaultData.push({ label: "None", value: "0" });
  }

  if (sizing) {
    Object.entries(sizing).forEach(([value, description]) => {
      defaultData.push({ label: value.toUpperCase(), value, description });
    });
  }

  if (showFullscreen && sizing) {
    defaultData.push({
      label: "Fullscreen",
      value: "fullscreen",
      description: "Full screen",
    });
  } else if (showFullscreen) {
    defaultData.push({ label: "Fullscreen", value: "fullscreen" });
  }

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
