import { ICON_SIZE } from "@/utils/config";
import { Menu, Stack, Text } from "@mantine/core";

import { Icon } from "@/components/Icon";
import NavigationAvatarFooter from "@/components/NavigationAvatarFooter";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useState } from "react";

export const DashboardUserMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = usePropelAuthStore((state) => state.user);
  const logout = usePropelAuthStore((state) => state.logout);

  return (
    <Menu withArrow>
      <Menu.Target>
        <NavigationAvatarFooter
          firstName={user?.firstName}
          lastName={user?.lastName}
          email={user?.email}
          pictureUrl={user?.pictureUrl}
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Stack w={200} spacing="xs">
          <Text size="xs" color="dimmed" pl="sm" pt="xs">
            Account
          </Text>

          <Menu.Item
            icon={<Icon name="IconLogout" size={ICON_SIZE} />}
            color="red"
            onClick={() => {
              setIsLoading(true);
              logout(true);
            }}
          >
            Logout
          </Menu.Item>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
};
