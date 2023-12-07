import { Select, SelectProps } from "@mantine/core";

export const SizeSelector = (
  props: Omit<SelectProps, "data"> | SelectProps,
) => {
  const defaultData = [
    { label: "None", value: "0" },
    { label: "Extra Small", value: "xs" },
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
    { label: "Extra Large", value: "xl" },
  ];
  const data = "data" in props ? props.data : defaultData;
  return <Select label="Size" size="xs" {...props} data={data} />;
};
