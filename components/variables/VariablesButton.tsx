import { ActionIconDefault } from "@/components/ActionIconDefault";
import { VariableForm } from "@/components/variables/VariableForm";
import { VariableList } from "@/components/variables/VariableList";
import { ButtonProps, Modal, SegmentedControl, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

type Props = ButtonProps & {
  projectId: string;
};

export const VariablesButton = ({ projectId }: Props) => {
  const [opened, modal] = useDisclosure(false);
  const [mode, setMode] = useState("list");

  return (
    <>
      <ActionIconDefault
        iconName="IconVariable"
        tooltip="Variables"
        onClick={modal.open}
      />

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
            <VariableForm />
          </Stack>
        )}
        {mode === "list" && (
          <Stack mt="xl">
            <VariableList projectId={projectId} />
          </Stack>
        )}
      </Modal>
    </>
  );
};
