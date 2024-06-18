import { ActionFormProps, ChangeLanguageAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { BindingField } from "@/components/editor/BindingField/BindingField";

type Props = ActionFormProps<Omit<ChangeLanguageAction, "name">>;

export const ChangeLanguageActionForm = ({ form }: Props) => {
  return (
    <Stack spacing="xs">
      <BindingField
        fieldType="Select"
        data={[
          { value: "en", label: "English" },
          { value: "fr", label: "French" },
        ]}
        {...form.getInputProps("language")}
      />
    </Stack>
  );
};
