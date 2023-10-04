import { useFlowStore } from "@/stores/flow";
import { OpenToastAction } from "@/utils/actions";
import { Button, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<OpenToastAction, "name">;

export const OpenToastFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  return (
    <Stack>
      <TextInput
        size="xs"
        placeholder="Notification title"
        label="Title"
        {...form.getInputProps("title")}
      />
      <TextInput
        size="xs"
        placeholder="Notification message"
        label="Message"
        {...form.getInputProps("message")}
      />
      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
