import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { getHoverColor } from "@/utils/branding";
import { componentMapper, structureMapper } from "@/utils/componentMapper";
import {
  Component,
  debouncedTreeComponentAttrsUpdate,
  getColorFromTheme,
} from "@/utils/editor";

type StateProps = {
  bg?: string | undefined;
  textColor?: string | undefined;
  isTransparentBackground?: boolean;
};

const createStateUpdateObject = (
  componentState: string,
  propertyName: string,
  propertyValue: string,
  hoverBackground: string,
  shouldUpdateHover: boolean,
) => {
  if (componentState === "default") {
    return {
      props: { [propertyName]: propertyValue },
      states: shouldUpdateHover
        ? { hover: { [propertyName]: hoverBackground } }
        : {},
    };
  } else {
    return {
      states: { [componentState]: { [propertyName]: propertyValue } },
    };
  }
};

export const useChangeState = ({
  bg,
  textColor,
  isTransparentBackground,
}: StateProps) => {
  const theme = useThemeStore((state) => state.theme);
  const defaultBg = isTransparentBackground ? "transparent" : "white";
  const backgroundColor = getColorFromTheme(theme, bg) ?? defaultBg;
  const color = getColorFromTheme(theme, textColor) ?? "black";

  const currentState = useEditorTreeStore(
    (state) =>
      state.currentTreeComponentsStates?.[state.selectedComponentIds?.[0]!] ??
      "default",
  );

  const componentsWithBackgroundModifier = Object.entries(
    componentMapper,
  ).reduce((acc, [componentName, { modifiers }]) => {
    if (
      modifiers.includes("background") &&
      structureMapper[componentName]?.category !== "Layout"
    ) {
      acc.push(componentName);
    }
    return acc;
  }, [] as string[]);

  const setBackgroundColor = (
    key: string,
    value: string,
    form: any,
    component?: Component,
  ) => {
    const hoverBackground = getHoverColor(value);
    form.setFieldValue(key, value);

    const shouldUpdateHover =
      !component || componentsWithBackgroundModifier.includes(component?.name);

    const treeUpdate = createStateUpdateObject(
      currentState,
      key,
      value,
      hoverBackground,
      shouldUpdateHover,
    );
    debouncedTreeComponentAttrsUpdate({ attrs: treeUpdate });
  };
  return {
    color,
    backgroundColor,
    setBackgroundColor,
  };
};
