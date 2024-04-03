import { Select, SelectProps, Stack, TextInput } from "@mantine/core";
import { useMemo, useState } from "react";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";

type SelectLogicalRulesProps = Omit<SelectProps, "data">;

const data = [
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
    description: "The Component's Value Matches A Specific Value",
  },
  {
    label: "Not Equal To",
    value: "notEqualTo",
    description: "The Component Does Contains This Specific Value",
  },
  {
    label: "Contains",
    value: "contains",
    description: "The Component Does Contains This Specific Value",
  },
  {
    label: "Not Contains",
    value: "notContains",
    description: "The Component Does Not Contain This Specific Value",
  },
  {
    label: "Equal To Multiple",
    value: "equalToMultiple",
    description:
      "The Component's Value Matches Any In A Set Of Specific Values",
  },
  {
    label: "Not Equal To Multiple",
    value: "notEqualToMultiple",
    description:
      "The Component's Value Matches None In A Set Of Specific Values",
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
    <Stack>
      <Select
        {...props}
        data={data}
        onChange={(value) => {
          props.onChange?.(value);
        }}
      />
      <TextInput
        value={comparingValue}
        onChange={(e) => {
          setComparingValue(e.target.value);
        }}
      />
    </Stack>
  );
};
