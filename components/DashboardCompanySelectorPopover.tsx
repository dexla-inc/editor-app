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
      bg="white"
      sx={(theme) => ({
        margin: "0 auto",
        borderTop: "1px solid " + theme.colors.gray[3],
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: theme.radius.sm,
      })}
      {...props}
    >
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          borderRadius: theme.radius.sm,

          "&:hover": {
            backgroundColor: theme.colors.gray[0],
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
