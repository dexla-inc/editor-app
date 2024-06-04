import { ActionFormProps, ChangeLanguageAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { ComponentToBindFromSelect } from "../ComponentToBindFromSelect";

type Props = ActionFormProps<Omit<ChangeLanguageAction, "name">>;

export const ChangeLanguageActionForm = ({ form }: Props) => {
  return (
    <Stack spacing="xs">
      <ComponentToBindFromSelect
        data={[
          { value: "en", label: "English" },
          { value: "fr", label: "French" },
        ]}
        {...form.getInputProps("language")}
      />
    </Stack>
  );
};
