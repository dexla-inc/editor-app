import { useShallow } from "zustand/react/shallow";
import { useResize } from "../hooks/useResize";
import { useDndGridStore } from "../stores/dndGridStore";

export const ResizeHandlers = ({ componentId }: any) => {
  const { handleResizeStart } = useResize();
  const { validComponent, invalidComponent } = useDndGridStore(
    useShallow((state) => state),
  );
  const isActive = useDndGridStore(
    (state) =>
      state.selectedComponentId === componentId ||
      state.hoverComponentId === componentId,
  );

  return (
    <>
      {validComponent === componentId && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(59, 130, 246, 0.3)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}
      {invalidComponent === componentId && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(239, 68, 68, 0.3)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}
      {isActive && (
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
      )}
    </>
  );
};
