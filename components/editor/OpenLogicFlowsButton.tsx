import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useLogicFlows } from "@/hooks/logic-flow/useLogicFlows";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memo } from "react";

const OpenLogicFlowsButton = () => {
  const { openLogicFlowsModal } = useLogicFlows();
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );

  const handleClick = () => {
    setSelectedComponentIds(() => []);
    openLogicFlowsModal();
  };

  return (
    <ActionIconDefault
      iconName="IconGitBranch"
      tooltip="Logic Flows"
      onClick={handleClick}
    />
  );
};

export default memo(OpenLogicFlowsButton);
