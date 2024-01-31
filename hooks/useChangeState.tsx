import { useEditorStore } from "@/stores/editor";
import { getHoverColor } from "@/utils/branding";
import {
  debouncedTreeComponentAttrsUpdate,
  getColorFromTheme,
} from "@/utils/editor";

type StateProps = {
  bg?: string | undefined;
  textColor?: string | undefined;
  isTransparentBackground?: boolean;
};

export const useChangeState = ({
  bg,
  textColor,
  isTransparentBackground,
}: StateProps) => {
  const theme = useEditorStore((state) => state.theme);
  const defaultBg = isTransparentBackground ? "transparent" : "white";
  const backgroundColor = getColorFromTheme(theme, bg) ?? defaultBg;
  const color = getColorFromTheme(theme, textColor) ?? "black";

  const setBackgroundColor = (
    key: string,
    value: string,
    form: any,
    currentState: string,
  ) => {
    const hoverBackground = getHoverColor(value);
    form.setFieldValue(key, value);
    const defaultStateUpdate = { hover: { [key]: hoverBackground } };
    const nonDefaultStateUpdate = {
      [currentState]: { [key]: hoverBackground },
    };

    const treeUpdate: Record<string, any> = {
      ...(currentState === "default" && {
        props: { [key]: value },
        states: defaultStateUpdate,
      }),
      ...(currentState !== "default" && { states: nonDefaultStateUpdate }),
    };
    debouncedTreeComponentAttrsUpdate(treeUpdate);
  };
  return {
    color,
    backgroundColor,
    setBackgroundColor,
  };
};
