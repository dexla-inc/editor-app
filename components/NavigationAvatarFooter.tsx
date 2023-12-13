import { Icon } from "@/components/Icon";
import {
  GREEN_COLOR,
  THIN_DARK_OUTLINE,
  THIN_GRAY_OUTLINE,
} from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import { Avatar, Box, Flex, Stack, Text, UnstyledButton } from "@mantine/core";
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
  return (
    <Box
      ref={ref}
      sx={(theme) => ({
        margin: "0 auto",
        borderTop:
          theme.colorScheme === "dark" ? THIN_DARK_OUTLINE : THIN_GRAY_OUTLINE,
      })}
      {...props}
    >
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? GREEN_COLOR : theme.colors.dark[8],

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[0],
          },
        })}
        px="sm"
        py={4}
      >
        {(props.firstName ||
          props.lastName ||
          props.email ||
          props.pictureUrl) && (
          <Flex py="xs" align="center" gap="xs">
            <Avatar src={props?.pictureUrl} radius="xl" />
            <Flex justify="space-between" w="100%">
              <Stack spacing={0} maw={145}>
                {props?.firstName && props.lastName && (
                  <Text size="sm" weight={500} sx={{ whiteSpace: "nowrap" }}>
                    {`${props?.firstName} ${props?.lastName}`}
                  </Text>
                )}
                <Text color="dimmed" size="xs" truncate>
                  {props?.email}
                </Text>
              </Stack>
              <Flex>{<Icon name="IconChevronDown" size={ICON_SIZE} />}</Flex>
            </Flex>
          </Flex>
        )}
      </UnstyledButton>
    </Box>
  );
});

NavigationAvatarFooter.displayName = "Profile";

export default NavigationAvatarFooter;
