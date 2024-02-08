import { ActionFormProps, AlertAction } from "@/utils/actions";
import { Stack, TextInput } from "@mantine/core";

type Props = ActionFormProps<Omit<AlertAction, "name">>;

export const DebugActionForm = ({ form }: Props) => {
  return (
    <Stack spacing="xs">
      <TextInput
        size="xs"
        label="Message"
        placeholder="The message to show"
        {...form.getInputProps("message")}
      />
    </Stack>
  );
};
