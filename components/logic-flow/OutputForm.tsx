import { UseFormReturnType } from "@mantine/form";
import {
  TextInput,
  Group,
  Text,
  Button,
  Stack,
  Select,
  Divider,
} from "@mantine/core";
import { Node } from "reactflow";
import { NodeOutput } from "@/components/logic-flow/nodes/CustomNode";
import { forwardRef, useEffect } from "react";
import startCase from "lodash.startcase";
import {
  getDescriptionFromTriggerCondition,
  triggerConditions,
} from "@/utils/triggerConditions";
import { nanoid } from "nanoid";

type FormValues = {
  outputs: NodeOutput[];
};

type OutputFormProps = {
  form: UseFormReturnType<FormValues>;
  node: Partial<Node>;
};

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  description: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Text size="sm">{label}</Text>
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      </Group>
    </div>
  ),
);

export const OutputForm = ({ form, node }: OutputFormProps) => {
  useEffect(() => {
    if (!form.isTouched("outputs")) {
      form.setFieldValue("outputs", node.data.outputs);
    }
  }, [node.data, form]);

  return (
    <Stack spacing="sm">
      <Group position="center" grow>
        <Button
          size="xs"
          variant="default"
          onClick={() =>
            form.insertListItem("outputs", {
              id: nanoid(),
              name: `Condition ${form.values.outputs.length + 1}`,
            })
          }
        >
          Add Condition
        </Button>
      </Group>

      {form.values.outputs?.map((item: NodeOutput, index: number) => {
        return (
          <Stack key={item.id}>
            {index > 0 && <Divider my="md" />}
            <Group mt="xs" position="apart" noWrap>
              <TextInput
                size="sm"
                placeholder="Name"
                label="Name"
                maw="48%"
                {...form.getInputProps(`outputs.${index}.name`)}
              />
              <Select
                size="sm"
                label="Condition"
                placeholder="Pick one"
                itemComponent={SelectItem}
                maxDropdownHeight={500}
                maw="48%"
                data={triggerConditions.map((tc) => ({
                  label: startCase(tc),
                  value: tc,
                  desctiption: getDescriptionFromTriggerCondition(tc),
                }))}
                {...form.getInputProps(`outputs.${index}.triggerCondition`)}
              />
            </Group>
            {item.triggerCondition && item.triggerCondition !== "none" && (
              <TextInput
                size="sm"
                placeholder="Condition value"
                w="100%"
                {...form.getInputProps(
                  `outputs.${index}.triggerConditionValue`,
                )}
              />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};
