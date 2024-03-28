import { Badge } from "@mantine/core";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "reactflow";

export const CustomEdge = ({
  id,
  label,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <Badge
          radius="lg"
          color="gray"
          variant="filled"
          style={{
            fontSize: "6px",
            padding: "2px 5px",
            height: "12px",
            textTransform: "none",
            position: "absolute",
            zIndex: 10,
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className="nodrag nopan"
        >
          {label}
        </Badge>
      </EdgeLabelRenderer>
    </>
  );
};

export const edgeTypes = {
  "custom-edge": CustomEdge,
};
