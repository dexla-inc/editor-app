import BindingPopover from "@/components/BindingPopover";
import { ValueProps } from "@/utils/types";
import { Flex, MantineTheme, TextInput, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  children?: React.ReactNode;
  isPageAction?: boolean;
};

export const ComponentToBindWrapper = ({
  value,
  onChange,
  children,
  isPageAction,
}: Props) => {
  const [
    isBindingPopOverOpen,
    { open: onOpenBindingPopOver, close: onCloseBindingPopOver },
  ] = useDisclosure(false);

  const theme = useMantineTheme();
  const styles = useTextInputStyles(theme);

  return (
    <Flex align="end" gap="xs" pos="relative">
      {value?.dataType === "boundCode" && (
        <TextInput
          pos="absolute"
          w="100%"
          styles={styles}
          readOnly
          value="< Edit Code >"
          disabled={isBindingPopOverOpen}
          onClick={onOpenBindingPopOver}
        />
      )}
      {children}
      <BindingPopover
        isPageAction={isPageAction}
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

export const useTextInputStyles = (theme: MantineTheme) => ({
  root: { zIndex: 100 },
  input: {
    cursor: "pointer",
    backgroundColor: theme.colors.teal[4],
    color: theme.black,
    "&:disabled": {
      opacity: 1,
      color: theme.black,
      backgroundColor: theme.colors.teal[5],
    },
    "&:hover": { backgroundColor: theme.colors.teal[5] },
  },
});
