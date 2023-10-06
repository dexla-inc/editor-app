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
        <ActionsSequence />
      </Box>
      {actionsSections}
    </Stack>
  );
};

export const ActionsSequence = () => {
  const [addForm, { open, close }] = useDisclosure(false);

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
          Add Action
        </Button>
      )}
      {addForm && <ActionsForm close={close} />}
    </>
  );
};
