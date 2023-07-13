import { Select, SelectProps } from "@mantine/core";

export const SizeSelector = (props: Omit<SelectProps, "data">) => {
  return (
    <Select
      label="Size"
      size="xs"
      {...props}
      data={[
        { label: "Extra Small", value: "xs" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
      ]}
    />
  );
};
