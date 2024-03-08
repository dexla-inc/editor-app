import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useLogicFlows } from "@/hooks/logic-flow/useLogicFlows";

const OpenLogicFlowsButton = () => {
  const { openLogicFlowsModal } = useLogicFlows();

  return (
    <ActionIconDefault
      iconName="IconGitBranch"
      tooltip="Logic Flows"
      onClick={openLogicFlowsModal}
    />
  );
};

export default OpenLogicFlowsButton;
