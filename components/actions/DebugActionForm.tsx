import { AlertAction } from "@/utils/actions";
import { Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<AlertAction, "name">>;
};

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
