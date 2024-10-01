import { useResize } from "../hooks/useResize";

export const ResizeHandlers = ({ componentId }: any) => {
  const { handleResizeStart } = useResize();

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          width: "0.75rem",
          height: "1.75rem",
          backgroundColor: "white",
          border: "2px solid #3b82f6",
          transform: "translate(-50%, -50%)",
          borderRadius: "0.5rem",
          cursor: "ew-resize",
          pointerEvents: "auto",
          zIndex: 20,
        }}
        onMouseDown={(e) => handleResizeStart("left", e, componentId)}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "0",
          width: "0.75rem",
          height: "1.75rem",
          backgroundColor: "white",
          border: "2px solid #3b82f6",
          transform: "translate(50%, -50%)",
          borderRadius: "0.5rem",
          cursor: "ew-resize",
          pointerEvents: "auto",
          zIndex: 20,
        }}
        onMouseDown={(e) => handleResizeStart("right", e, componentId)}
      />
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          width: "1.75rem",
          height: "0.75rem",
          backgroundColor: "white",
          border: "2px solid #3b82f6",
          transform: "translate(-50%, -50%)",
          borderRadius: "0.5rem",
          cursor: "ns-resize",
          pointerEvents: "auto",
          zIndex: 20,
        }}
        onMouseDown={(e) => handleResizeStart("top", e, componentId)}
      />
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          width: "1.75rem",
          height: "0.75rem",
          backgroundColor: "white",
          border: "2px solid #3b82f6",
          transform: "translate(-50%, 50%)",
          borderRadius: "0.5rem",
          cursor: "ns-resize",
          pointerEvents: "auto",
          zIndex: 20,
        }}
        onMouseDown={(e) => handleResizeStart("bottom", e, componentId)}
      />
    </>
  );
};
