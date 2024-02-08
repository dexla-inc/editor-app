import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { GoToUrlAction } from "@/utils/actions";
import { Button, Checkbox, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<GoToUrlAction, "name">;

export const GoToUrlFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

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

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
