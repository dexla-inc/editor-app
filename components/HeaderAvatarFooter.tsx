import { ICON_SIZE } from "@/utils/config";
import {
  Avatar,
  Box,
  Flex,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { forwardRef } from "react";
import { Icon } from "./Icon";

type NavigationAvatarFooterProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  pictureUrl?: string;
};

const NavigationAvatarFooter = forwardRef<
  HTMLDivElement,
  NavigationAvatarFooterProps
>((props, ref) => {
  const theme = useMantineTheme();
  const isDarkTheme = theme.colorScheme === "dark";

  return (
    <Box
      ref={ref}
      sx={{
        margin: "0 auto",
        width: "95%",
      }}
      {...props}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          borderRadius: theme.radius.sm,
          color: isDarkTheme ? theme.colors.gray[4] : theme.colors.dark[8],

          "&:hover": {
            backgroundColor: isDarkTheme
              ? theme.colors.dark[4]
              : theme.colors.gray[0],
          },
        }}
      >
        {(props.firstName ||
          props.lastName ||
          props.email ||
          props.pictureUrl) && (
          <Flex py="xs" align="center" gap="xs">
            <Avatar src={props?.pictureUrl} radius="xl" />
            <Box sx={{ flex: 1 }}>
              {props?.firstName && props.lastName && (
                <Text size="sm" weight={500} sx={{ whiteSpace: "nowrap" }}>
                  {`${props?.firstName} ${props?.lastName}`}
                </Text>
              )}
              <Text color="dimmed" size="xs">
                {props?.email}
              </Text>
            </Box>
            <Flex>{<Icon name="IconChevronDown" size={ICON_SIZE} />}</Flex>
          </Flex>
        )}
      </UnstyledButton>
    </Box>
  );
});

NavigationAvatarFooter.displayName = "Profile";

export default NavigationAvatarFooter;
