import NavigationAvatarFooter from "@/components/NavigationAvatarFooter";
import { HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import { Box, Menu, Navbar, ScrollArea } from "@mantine/core";
import { User, useLogoutFunction } from "@propelauth/react";

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
        </Menu>
      </Navbar.Section>
    </Navbar>
  );
}
