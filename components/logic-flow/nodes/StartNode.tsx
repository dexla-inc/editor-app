import { NodeProps } from "reactflow";
import { IconPlayerPlay } from "@tabler/icons-react";
import { CustomNode, NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { nanoid } from "nanoid";

interface StartNodeData extends NodeData {}

export const StartNode = (node: NodeProps<StartNodeData>) => {
  return <CustomNode {...node} avatar={NodeAvatar} />;
};

export const data: StartNodeData = {
  label: "Start",
  description: "The starting point of a flow",
  inputs: [],
  outputs: [{ id: nanoid(), name: "Initial Trigger" }],
  isNotEditable: true,
};

export const NodeAvatar = (props: any) => {
  return <IconPlayerPlay {...props} />;
};
