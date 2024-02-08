import { ChangeLanguageAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<ChangeLanguageAction, "name">>;
};

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
