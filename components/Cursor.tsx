import { useEditorStore } from "@/stores/editor";

type Props = {
  color: string;
  x: number;
  y: number;
  name: string;
};

export const Cursor = ({ color, x, y, name }: Props) => {
  const liveblocks = useEditorStore((state) => state.liveblocks);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "translateY(-18px)" }}
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
      <div
        style={{
          backgroundColor: color,
          color: "black",
          marginBottom: "10px",
          marginLeft: "-15px",
          padding: "2px 4px",
          borderRadius: "4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
    </div>
  );
};
