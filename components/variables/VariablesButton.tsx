import { VariableForm } from "@/components/variables/VariableForm";
import {
  Button,
  ButtonProps,
  Modal,
  SegmentedControl,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { VariableList } from "./VariableList";

type Props = ButtonProps & {
  pageId: string;
  projectId: string;
};

export const VariablesButton = ({ projectId, pageId, ...rest }: Props) => {
  const [opened, modal] = useDisclosure(false);
  const [mode, setMode] = useState("list");

  return (
    <>
      <Button {...rest} variant="default" onClick={modal.open}>
        Variables
      </Button>
      <Modal
        title="Variables"
        opened={opened}
        onClose={modal.close}
        centered
        size="lg"
      >
        <SegmentedControl
          size="sm"
          value={mode}
          fullWidth
          onChange={setMode}
          data={[
            { label: "Existing", value: "list" },
            { label: "Create", value: "create" },
          ]}
        />
        {mode === "create" && (
          <Stack mt="xl">
            <VariableForm projectId={projectId} pageId={pageId} />
          </Stack>
        )}
        {mode === "list" && (
          <Stack mt="xl">
            <VariableList projectId={projectId} pageId={pageId} />
          </Stack>
        )}
      </Modal>
    </>
  );
};
