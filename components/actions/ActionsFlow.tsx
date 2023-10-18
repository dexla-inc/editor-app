import { ActionsForm } from "@/components/actions/ActionsForm";
import { Box, Button, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  actionsSections: (JSX.Element | undefined)[];
};

export const ActionsFlow = ({ actionsSections }: Props) => {
  return (
    <Stack>
      <Box px="md">
        <ActionsSequence actionCount={actionsSections.length} />
      </Box>
      {actionsSections}
    </Stack>
  );
};

type ActionsSequenceProps = {
  actionCount: number;
};

export const ActionsSequence = ({ actionCount }: ActionsSequenceProps) => {
  const [addForm, { open, close }] = useDisclosure(false);

  const showAddForm = addForm || actionCount === 0;

  return (
    <>
      {!showAddForm && (
        <Button
          onClick={open}
          size="xs"
          type="button"
          variant="light"
          w={"100%"}
        >
          Add Action
        </Button>
      )}
      {showAddForm && <ActionsForm close={close} />}
    </>
  );
};
