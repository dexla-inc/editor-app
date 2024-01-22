export const useHoverEvents = (
  setHoveredComponentId: (hoveredComponentId?: string | undefined) => void,
  updateOverlays: any,
  hoveredComponentId: any,
  iframeWindow: any,
) => {
  const handleMouseEnter = (e: any, id?: string) => {
    e.stopPropagation();
    const newHoveredId = e.currentTarget.id;
    setHoveredComponentId(newHoveredId);
    const element = (iframeWindow ?? window).document.getElementById(
      id ?? newHoveredId,
    );
    updateOverlays(element);
  };

  const handleMouseLeave = (e: any) => {
    e.stopPropagation(); // Stop the event from bubbling up to prevent child's onMouseLeave affecting parent
    setTimeout(() => {
      if (hoveredComponentId === e.currentTarget?.id) {
        setHoveredComponentId("");
      }
    }, 10);
  };

  return {
    handleMouseEnter,
    handleMouseLeave,
  };
};
