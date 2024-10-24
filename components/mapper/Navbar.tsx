import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { Box, BoxProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
type Props = EditableComponentMapper & BoxProps;

const NavbarComponent = forwardRef(
  (
    {
      renderTree,
      component,
      shareableContent,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const theme = useThemeStore((state) => state.theme);

    const {
      children,
      bg = "",
      triggers,
      ...componentProps
    } = component.props as any;

    const backgroundColor = getColorFromTheme(theme, bg);

    merge(componentProps, { style: { ...props.style, backgroundColor } });

    return (
      <Box display="grid" {...props} {...componentProps} {...triggers}>
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child) =>
            renderTree(child, shareableContent),
          )}
        <ChildrenWrapper />
      </Box>
    );
  },
);

NavbarComponent.displayName = "Navbar";

export const Navbar = memo(withComponentWrapper(NavbarComponent));
