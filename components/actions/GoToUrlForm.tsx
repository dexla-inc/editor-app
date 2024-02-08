import { ActionFormProps, GoToUrlAction } from "@/utils/actions";
import { Checkbox, Stack } from "@mantine/core";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";

type Props = ActionFormProps<Omit<GoToUrlAction, "name">>;

export const GoToUrlForm = ({ form }: Props) => {
  return (
    <Stack>
      <ComponentToBindFromInput
        size="xs"
        placeholder="Enter a URL"
        label="URL"
        {...form.getInputProps("url")}
      />

      <Checkbox
        label="Open in new tab"
        {...form.getInputProps("openInNewTab", { type: "checkbox" })}
      />
    </Stack>
  );
};
