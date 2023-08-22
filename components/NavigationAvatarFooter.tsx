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
import { IconChevronRight } from "@tabler/icons-react";
import { forwardRef } from "react";

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

  return (
    <Box
      ref={ref}
      sx={{
        margin: "0 10px",
        padding: "10px 0",
        borderTop: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.gray[3]
            : theme.colors.gray[5]
        }`,
        width: "100%",
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
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[4],

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.gray[0]
                : theme.colors.dark[4],
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
                <Text size="sm" weight={500}>
                  {`${props?.firstName} ${props?.lastName}`}
                </Text>
              )}
              <Text color="dimmed" size="xs">
                {props?.email}
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
