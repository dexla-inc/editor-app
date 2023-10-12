import { ComponentToBindActionsPopover } from "@/components/ComponentToBindActionsPopover";
import { VariablePicker } from "@/components/VariablePicker";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { GoToUrlAction } from "@/utils/actions";
import { Button, Checkbox, Flex, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<GoToUrlAction, "name">;

export const GoToUrlFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const { setComponentToBind } = useEditorStore();

  return (
    <Stack>
      <TextInput
        size="xs"
        placeholder="Enter a URL"
        label="URL"
        {...form.getInputProps("url")}
        rightSection={
          <Flex px={5}>
            <VariablePicker
              onSelectValue={(selected) => {
                form.setFieldValue("url", selected);
              }}
            />
            <ComponentToBindActionsPopover
              onPick={(componentToBind: string) => {
                form.setFieldValue("url", componentToBind);
                setComponentToBind(undefined);
              }}
            />
          </Flex>
        }
        rightSectionWidth="auto"
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
