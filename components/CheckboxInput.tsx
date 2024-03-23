import { Icon } from "@/components/Icon";
import { Checkbox, CheckboxProps, Flex, Stack, Tooltip } from "@mantine/core";
import * as Icons from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { TopLabel } from "./TopLabel";

export type IconNames = keyof typeof Icons;
export type CheckboxInputData = Array<{
  name: string;
  defaultValue: string | number;
  value: string | number;
  propName: string;
  iconName: IconNames;
}>;

interface Props extends Omit<CheckboxProps, "onChange"> {
  data: CheckboxInputData;
  getInputProps: (val: string) => any;
  label?: string;
  onChange?: (prop: string, value: string | number) => void;
}

export const CheckboxInput = ({
  label,
  data,
  getInputProps,
  ...props
}: Props) => {
  return (
    <Stack spacing={0}>
      {label && <TopLabel text={label} />}
      <Flex gap={2}>
        {data.map((item) => {
          const inputProps = getInputProps(item.propName);
          return (
            <Tooltip key={item.name} label={startCase(item.name)}>
              <Checkbox
                size="md"
                color="gray"
                indeterminate
                icon={(checked) => <Icon {...checked} name={item.iconName} />}
                {...inputProps}
                checked={item.value === inputProps.value}
                {...props}
                onChange={(e) => {
                  if (props.onChange) {
                    props.onChange(
                      item.propName,
                      e.currentTarget.checked ? item.value : item.defaultValue,
                    );
                  }
                }}
                styles={{
                  root: { width: "100%" },
                  inner: { width: "100%" },
                  input: { width: "100%" },
                }}
              />
            </Tooltip>
          );
        })}
      </Flex>
    </Stack>
  );
};
