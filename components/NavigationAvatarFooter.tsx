import { ICON_SIZE } from "@/utils/config";
import {
  Avatar,
  Box,
  Flex,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { User } from "@propelauth/react";
import { IconChevronRight } from "@tabler/icons-react";
import { forwardRef } from "react";

type NavigationAvatarFooterProps = {
  user: User | null | undefined;
};

const NavigationAvatarFooter = forwardRef<
  HTMLDivElement,
  NavigationAvatarFooterProps
>((props, ref) => {
  const theme = useMantineTheme();

  return (
    <Box
      ref={ref}
      sx={{
        borderTop: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
      {...props}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        {props.user && (
          <Flex py="xs" align="center" gap="xs">
            <Avatar src={props.user?.pictureUrl} radius="xl" />
            <Box sx={{ flex: 1 }}>
              {props.user?.firstName && props.user.lastName && (
                <Text size="sm" weight={500}>
                  {`${props.user?.firstName} ${props.user?.lastName}`}
                </Text>
              )}
              <Text color="dimmed" size="xs">
                {props.user?.email}
              </Text>
            </Box>
            {<IconChevronRight size={ICON_SIZE} />}
          </Flex>
        )}
      </UnstyledButton>
    </Box>
  );
});

NavigationAvatarFooter.displayName = "Profile";

export default NavigationAvatarFooter;
