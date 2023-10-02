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
  ({ label, description, ...others }: ItemProps, ref) => {
    return (
      <div ref={ref} {...others}>
        <Stack spacing={0}>
          <Text size="sm">{label}</Text>
          {/* @ts-ignore */}
          <Text size="xs" color={others.selected ? "white" : "dimmed"}>
            {description}
          </Text>
        </Stack>
      </div>
    );
  },
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
            <Stack mt="xs">
              <TextInput
                size="xs"
                placeholder="Name"
                label="Name"
                {...form.getInputProps(`outputs.${index}.name`)}
              />
              <Select
                size="xs"
                label="Condition"
                placeholder="Pick one"
                itemComponent={SelectItem}
                maxDropdownHeight={500}
                withinPortal
                data={triggerConditions.map((tc) => ({
                  label: startCase(tc),
                  value: tc,
                  description: getDescriptionFromTriggerCondition(tc),
                }))}
                {...form.getInputProps(`outputs.${index}.triggerCondition`)}
              />
            </Stack>
            {item.triggerCondition && item.triggerCondition !== "none" && (
              <TextInput
                size="xs"
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
