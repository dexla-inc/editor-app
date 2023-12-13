import {
  DARK_COLOR,
  DARK_MODE,
  GRAY_WHITE_COLOR,
  THIN_DARK_OUTLINE,
  THIN_GRAY_OUTLINE,
} from "@/utils/branding";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { Box, Flex, Stack, Text, UnstyledButton } from "@mantine/core";
import { OrgMemberInfo } from "@propelauth/react";
import {
  IconBuildingSkyscraper,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { forwardRef } from "react";

export type CompanySelectorProps = {
  company: OrgMemberInfo;
  //onCompanySelect: (companyId: string) => void;
};

const DashboardCompanySelectorPopover = forwardRef<
  HTMLDivElement,
  CompanySelectorProps
>((props, ref) => {
  const company = props.company;

  return (
    <Box
      ref={ref}
      m="xs"
      sx={(theme) => ({
        margin: "0 auto",
        borderTop:
          theme.colorScheme === "dark" ? THIN_DARK_OUTLINE : THIN_GRAY_OUTLINE,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: theme.radius.sm,
        background: theme.colorScheme === "dark" ? DARK_MODE : theme.white,
      })}
      {...props}
    >
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          borderRadius: theme.radius.sm,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark" ? DARK_COLOR : GRAY_WHITE_COLOR,
          },
        })}
        px="sm"
      >
        <Flex py="xs" align="center" gap="xs">
          {/* <Avatar src={props?.pictureUrl} radius="xl" /> */}
          <IconBuildingSkyscraper size={LARGE_ICON_SIZE} />
          <Box sx={{ flex: 1 }}>
            <Text color="dimmed" size="xs">
              Company
            </Text>
            <Text size="sm">{company.orgName}</Text>
          </Box>
          <Stack spacing={0}>
            {
              <>
                <IconChevronUp size={ICON_SIZE} />
                <IconChevronDown size={ICON_SIZE} />
              </>
            }
          </Stack>
        </Flex>
      </UnstyledButton>
    </Box>
  );
});

DashboardCompanySelectorPopover.displayName = "CompanySelectorPopover";

export default DashboardCompanySelectorPopover;
