import { useThemeStore } from "@/stores/theme";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { Box, BoxProps, ScrollArea } from "@mantine/core";
import merge from "lodash.merge";
import { memo } from "react";
type Props = EditableComponentMapper & BoxProps;

const NavbarComponent = ({
  renderTree,
  component,
  shareableContent,
  ...props
}: Props) => {
  const theme = useThemeStore((state) => state.theme);

  const { children, bg = "", ...componentProps } = component.props as any;

  const backgroundColor = getColorFromTheme(theme, bg);

  merge(componentProps, { style: { ...props.style, backgroundColor } });

  return (
    <Box display="grid" {...component.props} {...props}>
      <ScrollArea>
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child) => renderTree(child))}
      </ScrollArea>
    </Box>
  );
};

export const Navbar = memo(NavbarComponent, isSame);
