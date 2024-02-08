import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/utils/types";
import { Flex, Select, SelectProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import BindingPopover from "./BindingPopover";

type Props = Omit<SelectProps, "value" | "onChange"> & {
  componentId: string;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
};

export const ComponentToBindFromSelect = ({
  value,
  onChange,
  data,
  componentId,
}: Props) => {
  const [
    isBindingPopOverOpen,
    { open: onOpenBindingPopOver, close: onCloseBindingPopOver },
  ] = useDisclosure(false);

  return (
    <Flex gap="xs">
      <Select
        style={{ flex: "1" }}
        value={value?.static}
        size="xs"
        data={data}
        placeholder="Select State"
        nothingFound="Nothing found"
        searchable
        onChange={(e: string) => {
          onChange({ ...value, dataType: "static", static: e });
        }}
        {...AUTOCOMPLETE_OFF_PROPS}
      />
      <BindingPopover
        value={value}
        onChange={onChange}
        controls={{
          isOpen: isBindingPopOverOpen,
          onClose: onCloseBindingPopOver,
          onOpen: onOpenBindingPopOver,
        }}
        style="iconButton"
      />
    </Flex>
  );
};
