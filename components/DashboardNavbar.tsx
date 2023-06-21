import NavigationAvatarFooter from "@/components/NavigationAvatarFooter";
import { HEADER_HEIGHT, ICON_SIZE, NAVBAR_WIDTH } from "@/utils/config";
import { Box, Menu, Navbar, ScrollArea } from "@mantine/core";
import { User, useLogoutFunction } from "@propelauth/react";
import { IconLogout, IconSettings } from "@tabler/icons-react";

type DashboardNavbarProps = {
  isLoading?: boolean;
  setIsLoading: (isLoading: boolean) => void;
  user: User | null | undefined;
};

export default function DashboardNavbar({
  setIsLoading,
  user,
}: DashboardNavbarProps) {
  const logout = useLogoutFunction();

  return (
    <Navbar
      width={{ base: NAVBAR_WIDTH }}
      sx={{
        height: `calc(100% - ${HEADER_HEIGHT}px)`,
      }}
    >
      <Navbar.Section grow component={ScrollArea}>
        <Box py="sm"></Box>
      </Navbar.Section>
      <Navbar.Section>
        <Menu width={250} withArrow>
          <Menu.Target>
            <NavigationAvatarFooter user={user} />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item icon={<IconSettings size={ICON_SIZE} />} disabled>
              Settings
            </Menu.Item>
            <Menu.Item
              icon={<IconLogout size={ICON_SIZE} />}
              color="red"
              onClick={() => {
                setIsLoading(true);
                logout(true);
              }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Navbar.Section>
    </Navbar>
  );
}
