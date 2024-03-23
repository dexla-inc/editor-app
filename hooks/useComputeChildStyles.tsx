import { GRAY_OUTLINE } from "@/utils/branding";
import { useDataBinding } from "@/hooks/dataBinding/useDataBinding";

export const useComputeChildStyles = () => {
  const { computeValue } = useDataBinding();
  function computeChildStyles(
    propsWithOverwrites: any,
    currentState: any,
    isEditorMode: boolean,
  ) {
    const computedInitialStyles = Object.entries(
      propsWithOverwrites.style ?? {},
    ).reduce((acc, [key, value]) => {
      const isObject = typeof value === "object";
      acc[key] = isObject ? computeValue({ value: value as any }) : value;
      return acc;
    }, {} as any);

    const childStyles = {
      position: "relative",
      ...computedInitialStyles,
      ...(currentState === "hidden" && { display: "none" }),
      ...(currentState === "disabled" &&
        !isEditorMode && { pointerEvents: "none" }),

      outline:
        !isEditorMode && propsWithOverwrites.style?.outline === GRAY_OUTLINE
          ? "none"
          : propsWithOverwrites.style?.outline,
    };

    return childStyles;
  }

  return { computeChildStyles };
};
