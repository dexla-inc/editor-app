import { useEditorStore } from "@/stores/editor";
import { getHoverColor } from "@/utils/branding";
import { componentMapper, structureMapper } from "@/utils/componentMapper";
import {
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
  let treeUpdate: Record<string, any> = {};

  if (componentState === "default") {
    treeUpdate = {
      props: { [propertyName]: propertyValue },
      states: shouldUpdateHover
        ? { hover: { [propertyName]: hoverBackground } }
        : {},
    };
  } else {
    treeUpdate = {
      states: { [componentState]: { [propertyName]: propertyValue } },
    };
  }

  return treeUpdate;
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
    currentState: string,
    component?: any,
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
    debouncedTreeComponentAttrsUpdate(treeUpdate);
  };
  return {
    color,
    backgroundColor,
    setBackgroundColor,
  };
};
