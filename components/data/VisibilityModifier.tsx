import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { getComponentInitialDisplayValue } from "@/utils/common";
import { Group, Stack } from "@mantine/core";
import BindingPopover from "@/components/BindingPopover";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  form: any;
  componentId: string;
  componentName: string;
};

export const VisibilityModifier = ({ componentName, form }: Props) => {
  const [
    isBindingPopOverOpen,
    { open: onOpenBindingPopOver, close: onCloseBindingPopOver },
  ] = useDisclosure(false);

  return (
    <Group spacing="xs" noWrap align="end">
      <Stack w="100%">
        <SegmentedControlInput
          label="Visibility"
          data={[
            {
              label: "Visible",
              value: getComponentInitialDisplayValue(componentName),
            },
            {
              label: "Hidden",
              value: "none",
            },
          ]}
          {...form.getInputProps("props.style.display")}
        />
      </Stack>
      <BindingPopover
        controls={{
          isOpen: isBindingPopOverOpen,
          onOpen: onOpenBindingPopOver,
          onClose: onCloseBindingPopOver,
        }}
        {...form.getInputProps(`props.style.display`)}
      />
    </Group>
  );
};
