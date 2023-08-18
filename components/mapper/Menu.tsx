import { ICON_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { Menu as MantineMenu, MenuProps } from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import NavigationAvatarFooter from "../NavigationAvatarFooter";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & MenuProps;

export const Menu = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    // <MantineMenu {...props} {...componentProps}>
    //   {component.children && component.children.length > 0
    //     ? component.children?.map((child) => renderTree(child))
    //     : children}
    // </MantineMenu>

    <MantineMenu width="100%" withArrow {...props}>
      <MantineMenu.Target>
        <NavigationAvatarFooter
          firstName="Tom"
          lastName="McDonough"
          email="tom@dexla.ai"
          pictureUrl="https://avatars.githubusercontent.com/u/12028086?v=4"
        />
      </MantineMenu.Target>
      <MantineMenu.Dropdown>
        <MantineMenu.Label>Account</MantineMenu.Label>
        <MantineMenu.Item icon={<IconSettings size={ICON_SIZE} />} disabled>
          Settings
        </MantineMenu.Item>
        <MantineMenu.Item icon={<IconLogout size={ICON_SIZE} />} color="red">
          Logout
        </MantineMenu.Item>
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
};
