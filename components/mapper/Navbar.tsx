import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { Box, BoxProps, ScrollArea } from "@mantine/core";
import merge from "lodash.merge";
import { memo } from "react";

type Props = EditableComponentMapper & BoxProps;

const NavbarComponent = ({ renderTree, component, ...props }: Props) => {
  const theme = useEditorStore((state) => state.theme);

  const { children, bg = "", ...componentProps } = component.props as any;

  const backgroundColor = getColorFromTheme(theme, bg);

  merge(componentProps, { style: { ...props.style, backgroundColor } });

  return (
    <ScrollArea>
      <Box display="grid" {...component.props} {...props}>
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child) => renderTree(child))}
      </Box>
    </ScrollArea>
  );
};

export const Navbar = memo(NavbarComponent, isSame);
