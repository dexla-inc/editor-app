import BindingPopover from "@/components/BindingPopover";
import { TopLabel } from "@/components/TopLabel";
import {
  Flex,
  MantineTheme,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useBindingField } from "@/components/ComponentToBindFromInput";
import { DynamicForm } from "@/components/editor/BindingField/handlers/DynamicForm";

type Props = {
  children: React.ReactNode;
};

export const ComponentToBindWrapper = ({ children }: Props) => {
  const { label, value } = useBindingField<"Text">();

  const [
    isBindingPopOverOpen,
    { open: onOpenBindingPopOver, close: onCloseBindingPopOver },
  ] = useDisclosure(false);

  const theme = useMantineTheme();
  const styles = useTextInputStyles(theme);

  return (
    <Stack spacing={0} w="100%">
      {label && <TopLabel text={String(label)} required />}
      <Flex
        align="start"
        pos="relative"
        gap={5}
        style={{ flexGrow: 1, minHeight: 0, alignItems: "self-end" }}
        w="100%"
      >
        <DynamicForm>
          {["boundCode", "rules"].includes(value?.dataType!) && (
            <TextInput
              w="100%"
              styles={styles}
              readOnly
              value="< Edit Code >"
              disabled={isBindingPopOverOpen}
              onClick={onOpenBindingPopOver}
            />
          )}
          {(value?.dataType === "static" || !value?.dataType) && children}
          <BindingPopover
            controls={{
              isOpen: isBindingPopOverOpen,
              onClose: onCloseBindingPopOver,
              onOpen: onOpenBindingPopOver,
            }}
          />
        </DynamicForm>
      </Flex>
    </Stack>
  );
};

const useTextInputStyles = (theme: MantineTheme) => ({
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
