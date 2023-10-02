import { Button, Modal, SegmentedControl, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { VariableForm } from "@/components/variables/VariableForm";
import { VariableList } from "./VariableList";

type Props = {
  pageId: string;
  projectId: string;
};

export const VariablesButton = ({ projectId, pageId }: Props) => {
  const [opened, modal] = useDisclosure(false);
  const [mode, setMode] = useState("list");

  return (
    <>
      <Button variant="default" onClick={modal.open}>
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
            { label: "List", value: "list" },
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
