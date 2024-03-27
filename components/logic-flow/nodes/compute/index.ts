import { compute as actionNode } from "@/components/logic-flow/nodes/compute/actionNode";
import {
  onDeleteIfTrueOrFalseNode,
  onNodesPositionChange,
} from "@/components/logic-flow/nodes/compute/handleNodeDeletion";

export const computeNodeMapper: { [key: string]: any } = {
  actionNode,
};

export { onDeleteIfTrueOrFalseNode, onNodesPositionChange };
