import { RegionTypes } from "@/requests/projects/queries";
import { regionTypeFlags, regionTypes } from "@/utils/dashboardTypes";
import { Avatar, Group, Paper, Select, SelectProps, Text } from "@mantine/core";
import { forwardRef } from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
  flag: string;
}

const RegionSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ flag, label, ...others }: ItemProps, ref) => (
    <Paper ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={flag} size="sm" />

        <Text size="sm">{label}</Text>
      </Group>
    </Paper>
  ),
);
RegionSelectItem.displayName = "RegionSelectItem";

export default function RegionSelect(props: Omit<SelectProps, "data">) {
  return (
    <Select
      label="Region"
      description="The country your project will be deployed in"
      data={regionTypes}
      itemComponent={RegionSelectItem}
      icon={
        regionTypeFlags[props.value as RegionTypes] && (
          <Avatar src={regionTypeFlags[props.value as RegionTypes]} size="sm" />
        )
      }
      {...props}
    />
  );
}
