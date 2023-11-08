import { INPUT_SIZE } from "@/utils/config";
import { Select, SelectProps } from "@mantine/core";

export const FocusRingSelector = (props: Omit<SelectProps, "data">) => {
  return (
    <Select
      label="Focus ring"
      size={INPUT_SIZE}
      {...props}
      data={[
        { label: "Browser Default", value: "DEFAULT" },
        { label: "On Brand Thin", value: "ON_BRAND_THIN" },
        { label: "On Brand Thick", value: "ON_BRAND_THICK" },
      ]}
    />
  );
};
