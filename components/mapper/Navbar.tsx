import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { Box, BoxProps } from "@mantine/core";
import merge from "lodash.merge";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

const NavbarComponent = ({ renderTree, component, ...props }: Props) => {
  const theme = useEditorStore((state) => state.theme);

  const { children, bg = "", ...componentProps } = component.props as any;

  const backgroundColor = getColorFromTheme(theme, bg);

  merge(componentProps, { style: { ...props.style, backgroundColor } });

  return (
    // <MantineBox {...props} {...componentProps}>
    //   {component.children && component.children.length > 0
    //     ? component.children?.map((child) => renderTree(child))
    //     : children}
    // </MantineBox>

    <Box display="grid" {...component.props} {...props}>
      {component.children &&
        component.children.length > 0 &&
        component.children?.map((child: Component) => renderTree(child))}
    </Box>
  );
};

export const Navbar = memo(NavbarComponent, isSame);
