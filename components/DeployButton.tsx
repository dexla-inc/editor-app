import { Icon } from "@/components/Icon";
import { usePropelAuthStore } from "@/stores/propelAuth";
import {
  ActionIcon,
  Button,
  Flex,
  Popover,
  useMantineTheme,
} from "@mantine/core";
import { DeployButtonDropdown } from "./DeployButtonDropdown";

export const DeployButton = () => {
  const theme = useMantineTheme();
  const canDeploy = usePropelAuthStore(
    (state) => !!state.userPermissions.find((p) => p === "can_deploy"),
  );

  return (
    <Popover width={270} position="bottom-end" withArrow shadow="md">
      <Popover.Target>
        <Flex>
          <Button
            loaderPosition="center"
            disabled={!canDeploy}
            leftIcon={<Icon name="IconRocket" />}
            sx={{ borderRadius: "4px 0px 0px 4px" }}
          >
            Deploy
          </Button>
          <ActionIcon
            color="teal"
            variant="filled"
            disabled={!canDeploy}
            mah={26}
            mih={26}
            sx={{
              borderRadius: "0px 4px 4px 0px",
              borderLeft: "1px solid " + theme.colors.gray[2],
            }}
          >
            <Icon name="IconCaretDown" />
          </ActionIcon>
        </Flex>
      </Popover.Target>
      <Popover.Dropdown>
        <DeployButtonDropdown />
      </Popover.Dropdown>
    </Popover>
  );
};
