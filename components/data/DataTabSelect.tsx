import { SegmentedControl } from "@mantine/core";

export const DataTabSelect = ({ setFieldValue, ...props }: any) => {
  return (
    <SegmentedControl
      w="100%"
      size="xs"
      data={[
        { label: "Static", value: "static" },
        { label: "Dynamic", value: "dynamic" },
      ]}
      {...props}
      onChange={(e) => setFieldValue("dataType", e)}
    />
  );
};
