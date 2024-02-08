import { ActionFormProps, ChangeLanguageAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";

type Props = ActionFormProps<Omit<ChangeLanguageAction, "name">>;

export const ChangeLanguageActionForm = ({ form }: Props) => {
  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label="Change language to"
        placeholder="Select a language"
        data={[
          { value: "default", label: "English" },
          { value: "french", label: "French" },
        ]}
        {...form.getInputProps("language")}
      />
    </Stack>
  );
};
