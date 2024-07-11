import { Select, SelectProps, Text } from "@mantine/core";
import { forwardRef } from "react";

type SelectComparisonRuleFieldProps = Omit<SelectProps, "data">;

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  description: string;
}

export const logicalRulesData = [
  {
    label: "Equal To",
    value: "equalTo",
    description: "The selected location matches a specific value.",
    valuePlaceholder: "Type a value the selected location matches",
  },
  {
    label: "Not Equal To",
    value: "notEqualTo",
    description: "The selected location does not match a specific value.",
    valuePlaceholder: "Type a value the selected location does not match",
  },
  {
    label: "Has Value",
    value: "hasValue",
    description: "The selected location holds any value.",
  },
  {
    label: "Does Not Have Value",
    value: "doesNotHaveValue",
    description: "The selected location is empty or uninitialized.",
  },
  {
    label: "Contains",
    value: "contains",
    description: "The selected location contains this specific value.",
    valuePlaceholder: "Type a value the selected location does contain",
  },
  {
    label: "Not Contains",
    value: "notContains",
    description: "The selected location does not contain this specific value.",
    valuePlaceholder: "Type a value the selected location does not contain",
  },
  {
    label: "Equal To Multiple",
    value: "equalToMultiple",
    description:
      "The selected location value matches any in a set of specific values.",
    valuePlaceholder: "Type a value the selected location can be",
  },
  {
    label: "Not Equal To Multiple",
    value: "notEqualToMultiple",
    description:
      "The selected location value matches none in a set of specific values.",
    valuePlaceholder: "Type a value the selected location can not be",
  },
  {
    label: "Greater Than",
    value: "greaterThan",
    description:
      "The selected location's value is greater than a specific value.",
    valuePlaceholder: "Type a value the selected location is greater than",
  },
  {
    label: "Less Than",
    value: "lessThan",
    description: "The selected location's value is less than a specific value.",
    valuePlaceholder: "Type a value the selected location is less than",
  },
  {
    label: "Greater Than or Equal To",
    value: "greaterThanOrEqualTo",
    description:
      "The selected location's value is greater than or equal to a specific value.",
    valuePlaceholder:
      "Type a value the selected location is greater than or equal to",
  },
  {
    label: "Less Than or Equal To",
    value: "lessThanOrEqualTo",
    description:
      "The selected location's value is less than or equal to a specific value.",
    valuePlaceholder:
      "Type a value the selected location is less than or equal to",
  },
];

export const SelectComparisonRuleField = (
  props: SelectComparisonRuleFieldProps,
) => {
  return (
    <Select
      {...props}
      label="Rule"
      mt={2}
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
