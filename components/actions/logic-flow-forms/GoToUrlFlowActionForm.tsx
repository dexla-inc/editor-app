import { GoToUrlAction } from "@/utils/actions";
import { Button, Checkbox, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { VariablePicker } from "@/components/VariablePicker";
import { useFlowStore } from "@/stores/flow";

type Props = {
  id: string;
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<GoToUrlAction, "name">;

export const GoToUrlFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  return (
    <Stack>
      <TextInput
        size="xs"
        placeholder="Enter a URL"
        label="URL"
        {...form.getInputProps("url")}
        rightSection={
          <VariablePicker
            onSelectValue={(selected) => {
              form.setFieldValue("url", selected);
            }}
          />
        }
      />
      <Checkbox
        label="Open in new tab"
        {...form.getInputProps("openInNewTab", { type: "checkbox" })}
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
