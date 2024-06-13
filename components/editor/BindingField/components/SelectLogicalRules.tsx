import { Select, SelectProps, Text } from "@mantine/core";
import { forwardRef, useMemo, useState } from "react";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";

type SelectLogicalRulesProps = Omit<SelectProps, "data">;

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  description: string;
}

export const logicalRulesData = [
  {
    label: "Has Value",
    value: "hasValue",
    description: "The component Holds Any Value",
  },
  {
    label: "Does Not Have Value",
    value: "doesNotHaveValue",
    description: "The Component Is Empty Or Uninitialized",
  },
  {
    label: "Equal To",
    value: "equalTo",
    description: "The Component's Value Does Matches A Specific Value",
    valuePlaceholder: "Type a value the Component matches",
  },
  {
    label: "Not Equal To",
    value: "notEqualTo",
    description: "The Component's Value Does Not Match A Specific Value",
    valuePlaceholder: "Type a value the Component does not match",
  },
  {
    label: "Contains",
    value: "contains",
    description: "The Component Does Contains This Specific Value",
    valuePlaceholder: "Type a value the Component does contains",
  },
  {
    label: "Not Contains",
    value: "notContains",
    description: "The Component Does Not Contain This Specific Value",
    valuePlaceholder: "Type a value the Component does not contain",
  },
  {
    label: "Equal To Multiple",
    value: "equalToMultiple",
    description:
      "The Component's Value Matches Any In A Set Of Specific Values",
    valuePlaceholder: "Type a value the Component can be",
  },
  {
    label: "Not Equal To Multiple",
    value: "notEqualToMultiple",
    description:
      "The Component's Value Matches None In A Set Of Specific Values",
    valuePlaceholder: "Type a value the Component can not be",
  },
];

export const SelectLogicalRules = (props: SelectLogicalRulesProps) => {
  const [comparingValue, setComparingValue] = useState("");

  const dataHandlers: Record<string, (val: any) => boolean> = useMemo(
    () => ({
      hasValue: (val) => !isEmpty(val),
      doesNotHaveValue: (val) => isEmpty(val),
      equalTo: (val) => val === comparingValue,
      notEqualTo: (val) => val !== comparingValue,
      contains: (val) => val.includes(comparingValue),
      notContains: (val) => !val.includes(comparingValue),
      equalToMultiple: (val) => isEqual(val, comparingValue),
      notEqualToMultiple: (val) => isEqual(val, comparingValue),
    }),
    [comparingValue],
  );

  return (
    <Select
      {...props}
      label="Rule"
      itemComponent={SelectItem}
      description="Choose from the logical rules for utility"
      data={logicalRulesData}
      onChange={(value) => {
        props.onChange?.(value);
      }}
    />
  );
};

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <div>
        <Text size="sm">{label}</Text>
        <Text size="xs" opacity={0.65}>
          {description}
        </Text>
      </div>
    </div>
  ),
);
