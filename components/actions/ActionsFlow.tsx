import { ActionsForm } from "@/components/actions/ActionsForm";
import { useEditorStore } from "@/stores/editor";
import { Box, Button, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  actionsSections: (JSX.Element | undefined)[];
};

export const ActionsFlow = ({ actionsSections }: Props) => {
  return (
    <Stack>
      <Box px="md">
        <ActionsSequence />
      </Box>
      {actionsSections}
    </Stack>
  );
};

export const ActionsSequence = () => {
  const [addForm, { open, close }] = useDisclosure(false);
  const sequentialTo = useEditorStore((state) => state.sequentialTo);
  const isSequential = !!sequentialTo;

  return (
    <>
      {!addForm && (
        <Button
          onClick={open}
          size="xs"
          type="button"
          variant="light"
          w={"100%"}
        >
          {isSequential ? "Add sequential action" : "Add action"}
        </Button>
      )}
      {addForm && (
        <ActionsForm open={open} close={close} sequentialTo={sequentialTo} />
      )}
    </>
  );
};
