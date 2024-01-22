import { useCallback, useMemo, useState } from "react";

export const useHoverEvents = (
  setHoveredComponentId: (hoveredComponentId?: string | undefined) => void,
  hoveredComponentId: any,
  iframeWindow: any,
) => {
  const [overlayStyles, setOverlayStyles] = useState({
    display: "none",
    position: {},
    padding: {},
    margin: {},
  });

  const computedOverlayStyles = useMemo(() => {
    return {
      ...overlayStyles,
      position: { ...overlayStyles.position },
      padding: { ...overlayStyles.padding },
      margin: { ...overlayStyles.margin },
    };
  }, [overlayStyles]);

  const updateOverlays = useCallback((element: any, display = "block") => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    setOverlayStyles({
      display,
      position: {
        width: rect.width + "px",
        height: rect.height + "px",
        top: rect.top + "px",
        left: rect.left + "px",
      },
      padding: {
        paddingTop: computedStyle.paddingTop,
        paddingRight: computedStyle.paddingRight,
        paddingBottom: computedStyle.paddingBottom,
        paddingLeft: computedStyle.paddingLeft,
      },
      margin: {
        marginTop: computedStyle.marginTop,
        marginRight: computedStyle.marginRight,
        marginBottom: computedStyle.marginBottom,
        marginLeft: computedStyle.marginLeft,
      },
    });
  }, []);

  const handleMouseEnter = useCallback(
    (e: any) => {
      e.stopPropagation();
      const newHoveredId = e.currentTarget.id;
      setHoveredComponentId(newHoveredId);
      const element = (iframeWindow ?? window).document.getElementById(
        newHoveredId,
      );
      updateOverlays(element);
    },
    [setHoveredComponentId, updateOverlays, iframeWindow],
  );

  const handleMouseLeave = useCallback(
    (e: any) => {
      e.stopPropagation();
      const leaveId = e.currentTarget.id;
      setTimeout(() => {
        if (hoveredComponentId === leaveId) {
          setHoveredComponentId("");
          setOverlayStyles((prevStyles) => ({
            ...prevStyles,
            display: "none",
          }));
        }
      }, 10);
    },
    [hoveredComponentId, setHoveredComponentId],
  );

  return {
    overlayStyles: computedOverlayStyles,
    handleMouseEnter,
    handleMouseLeave,
  };
};
