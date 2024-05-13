import BindingPopover from "@/components/BindingPopover";
import { TopLabel } from "@/components/TopLabel";
import { ValueProps } from "@/types/dataBinding";
import {
  Flex,
  MantineTheme,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  label?: string;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  children?: React.ReactNode;
  isPageAction?: boolean;
};

export const ComponentToBindWrapper = ({
  label,
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
    <Stack spacing={0} w="100%">
      {label && <TopLabel text={label} required />}
      <Flex
        align="start"
        // gap="xs"
        pos="relative"
        style={{ flexGrow: 1, minHeight: 0 }}
        w="100%"
      >
        {value?.dataType === "boundCode" ? (
          <TextInput
            w="100%"
            styles={styles}
            readOnly
            value="< Edit Code >"
            disabled={isBindingPopOverOpen}
            onClick={onOpenBindingPopOver}
          />
        ) : (
          children
        )}
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
    </Stack>
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
