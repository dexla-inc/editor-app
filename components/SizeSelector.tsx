import { Select, SelectItem, SelectProps } from "@mantine/core";

type Props = {
  showNone?: boolean;
  showFullscreen?: boolean;
} & Omit<SelectProps, "data">;

export const SizeSelector = ({
  showNone = true,
  showFullscreen = false,
  ...props
}: Props) => {
  const defaultData = [
    showNone && { label: "None", value: "0" },
    { label: "Extra Small", value: "xs" },
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
    { label: "Extra Large", value: "xl" },
    showFullscreen && { label: "Fullscreen", value: "fullscreen" },
  ].filter(Boolean) as SelectItem[];
  const data = ("data" in props ? props.data : defaultData) as SelectItem[];
  return <Select label="Size" size="xs" {...props} data={data} />;
};
