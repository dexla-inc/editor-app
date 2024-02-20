import { BORDER_COLOR } from "@/utils/branding";
import { ToggleMenuItem as ToggleMenuItemType } from "@/utils/dashboardTypes";
import { Box, Menu, rem, useMantineTheme } from "@mantine/core";
import { forwardRef } from "react";

type ToggleMenuProps = {
  name: string;
  items: ToggleMenuItemType[];
};

type ToggleMenuItemProps = ToggleMenuItemType;

const ToggleMenuItem: React.FC<ToggleMenuItemProps> = ({
  id,
  icon,
  onClick,
  text,
}) => {
  return (
    <Menu.Item key={id} icon={icon} onClick={onClick}>
      {text}
    </Menu.Item>
  );
};

const ToggleMenu = forwardRef<HTMLDivElement, ToggleMenuProps>((props, ref) => {
  const { name, items } = props;
  const theme = useMantineTheme();
  return (
    <Box
      ref={ref}
      sx={{
        borderTop: `${rem(1)} solid ${BORDER_COLOR}`,
      }}
    >
      <Menu>
        {items.map((item) => (
          <ToggleMenuItem key={item.id} {...item} />
        ))}
      </Menu>
    </Box>
  );
}) as any;

ToggleMenu.displayName = "togglename";
ToggleMenu.Item = ToggleMenuItem;

export default ToggleMenu;
