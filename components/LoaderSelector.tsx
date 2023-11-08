import { INPUT_SIZE } from "@/utils/config";
import { Select, SelectProps } from "@mantine/core";

export const LoaderSelector = (props: Omit<SelectProps, "data">) => {
  return (
    <Select
      label="Loader"
      size={INPUT_SIZE}
      {...props}
      data={[
        { label: "Oval", value: "OVAL" },
        { label: "Bars", value: "BARS" },
        { label: "Dots", value: "DOTS" },
      ]}
    />
  );
};
