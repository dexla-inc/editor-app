import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { extractColorName, getHoverColor } from "@/utils/branding";
import { componentMapper, structureMapper } from "@/utils/componentMapper";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import {
  Component,
  debouncedTreeComponentAttrsUpdate,
  getColorFromTheme,
} from "@/utils/editor";

type StateProps = {
  bg?: string | undefined;
  textColor?: string | undefined;
  placeholderColor?: string | undefined;
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
  placeholderColor,
  isTransparentBackground,
}: StateProps) => {
  const theme = useThemeStore((state) => state.theme);
  const defaultBg = isTransparentBackground ? "transparent" : "white";
  const backgroundColor = getColorFromTheme(theme, bg) ?? defaultBg;
  const color = getColorFromTheme(theme, textColor) ?? "black";
  const _placeholderColor =
    getColorFromTheme(theme, placeholderColor) ?? "black";

  const currentState = useEditorTreeStore((state) => {
    const selectedComponentId = selectedComponentIdSelector(state);
    return (
      state.currentTreeComponentsStates?.[selectedComponentId!] ?? "default"
    );
  });

  const componentsWithBackgroundModifier = Object.entries(
    componentMapper,
  ).reduce((acc, [componentName, { modifiers }]) => {
    if (
      modifiers.includes("background") &&
      structureMapper()[componentName]?.category !== "Layout"
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

  const getCalendarDayColors = () => {
    const bgWithoutIndex = extractColorName(bg ?? "").name;
    let selectedDayColor = backgroundColor;
    let rangeDayColor = getColorFromTheme(theme, `${bgWithoutIndex}.1`);
    if (
      ["#ffffff", "#000000"].includes(
        selectedDayColor.substring(0, 7).toLowerCase(),
      )
    ) {
      selectedDayColor = getColorFromTheme(theme, "Primary.6");
      rangeDayColor = getColorFromTheme(theme, "Primary.1");
    }
    return { selectedDayColor, rangeDayColor };
  };
  return {
    color,
    backgroundColor,
    setBackgroundColor,
    placeholderColor: _placeholderColor,
    getCalendarDayColors,
  };
};
