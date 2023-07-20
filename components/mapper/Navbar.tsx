import { Component } from "@/utils/editor";
import { BoxProps, Box as MantineBox } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const Navbar = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineBox {...props} {...componentProps}>
      {/* <Flex align="center" justify="space-between" mb="lg">
        <Image
          alt="logo"
          src="https://uploads-ssl.webflow.com/62a0c6d2136bdf9c8a2e41ef/6372524a20f971a3d46319ba_Logo.svg"
          sx={{ maxWidth: 155 }}
        />
        <IconArrowBarLeft />
      </Flex> */}
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineBox>
  );
};
