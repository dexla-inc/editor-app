import { ActionFormProps, GoToUrlAction } from "@/utils/actions";
import { Checkbox, Stack } from "@mantine/core";
import { BindingField } from "@/components/editor/BindingField/BindingField";

type Props = ActionFormProps<Omit<GoToUrlAction, "name">>;

export const GoToUrlForm = ({ form, isPageAction }: Props) => {
  return (
    <Stack>
      <BindingField
        fieldType="Text"
        size="xs"
        placeholder="Enter a URL"
        label="URL"
        isPageAction={isPageAction}
        {...form.getInputProps("url")}
      />

      <Checkbox
        label="Open in new tab"
        {...form.getInputProps("openInNewTab", { type: "checkbox" })}
      />
    </Stack>
  );
};
