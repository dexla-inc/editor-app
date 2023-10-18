import { VariableForm } from "@/components/variables/VariableForm";
import {
  ActionIcon,
  ButtonProps,
  Modal,
  SegmentedControl,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Icon } from "../Icon";
import { VariableList } from "./VariableList";

type Props = ButtonProps & {
  pageId: string;
  projectId: string;
};

export const VariablesButton = ({ projectId, pageId }: Props) => {
  const [opened, modal] = useDisclosure(false);
  const [mode, setMode] = useState("list");

  return (
    <>
      <Tooltip label="Variables" withArrow fz="xs">
        <ActionIcon onClick={modal.open} variant="default">
          <Icon name="IconVariable" />
        </ActionIcon>
      </Tooltip>
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
