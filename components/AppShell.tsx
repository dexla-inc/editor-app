import { Logo } from "@/components/Logo";

import {
  ASIDE_WIDTH,
  HEADER_HEIGHT,
  ICON_SIZE,
  NAVBAR_WIDTH,
} from "@/utils/config";
import {
  AppShell,
  AppShellProps,
  Box,
  Button,
  Group,
  Header,
  Select,
  Tooltip,
} from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import Link from "next/link";

import { AIChatHistoryButton } from "@/components/AIChatHistoryButton";
import { ChangeHistoryPopover } from "@/components/ChangeHistoryPopover";
import { DeployButton } from "@/components/DeployButton";
import { EditorPreviewModeToggle } from "@/components/EditorPreviewModeToggle";
import { GenerateAIButton } from "@/components/GenerateAIButton";
import { Icon } from "@/components/Icon";
import { LogicFlowButton } from "@/components/logic-flow/LogicFlowButton";
import { VariablesButton } from "@/components/variables/VariablesButton";
import { getPageList } from "@/requests/pages/queries";
import { PageListResponse } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";

export const Shell = ({ children, navbar, aside }: AppShellProps) => {
  const { resetTree, isPreviewMode, setPreviewMode, language, setLanguage } =
    useEditorStore((state) => state);

  const router = useRouter();
  const projectId = router.query.id as string;
  const currentPageId = router.query.page as string;

  const pageResponse = useQuery<PageListResponse, Error>({
    queryKey: ["pages"],
    queryFn: () => getPageList(projectId),
  });

  const authInfo = useAuthInfo();
  const org = authInfo.orgHelper?.getOrgByName("Dexla")!;
  const isDexlaAdmin = org?.userAssignedRole === "DEXLA_ADMIN";

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT} sx={{ zIndex: 110 }}>
          <Group h={HEADER_HEIGHT} px="xs" align="center" position="apart">
            <Group>
              <Tooltip label="Back to dashboard" fz="xs">
                <Link href="/">
                  <Logo />
                </Link>
              </Tooltip>
            </Group>

            <Group noWrap position="right" spacing="xs">
              <Select
                label="Language"
                value={language}
                onChange={setLanguage}
                size="xs"
                data={[
                  { value: "default", label: "English" },
                  { value: "french", label: "French" },
                ]}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  whiteSpace: "nowrap",
                  width: "160px",
                }}
                display="none"
              />
              {isDexlaAdmin && <AIChatHistoryButton projectId={projectId} />}
              <GenerateAIButton projectId={projectId} />
              <LogicFlowButton projectId={projectId} pageId={currentPageId} />
              <VariablesButton projectId={projectId} pageId={currentPageId} />

              <ChangeHistoryPopover />
              <EditorPreviewModeToggle
                isPreviewMode={isPreviewMode}
                setPreviewMode={setPreviewMode}
              />
              <Button
                component={Link}
                href={`/projects/${projectId}/settings/team`}
                leftIcon={<Icon name="IconUserPlus" size={ICON_SIZE} />}
                compact
                variant="default"
                target="_blank"
              >
                Invite
              </Button>
              <DeployButton
                projectId={projectId}
                page={pageResponse.data?.results?.find(
                  (p) => p.id === currentPageId,
                )}
              />
            </Group>
          </Group>
        </Header>
      }
      navbar={navbar}
      aside={aside}
      styles={{
        main: {
          minHeight: "100vh",
          paddingLeft: "var(--mantine-navbar-width, 0px)",
        },
      }}
    >
      <ErrorBoundary
        FallbackComponent={() => (
          <Box
            w={`calc(100vw - ${ASIDE_WIDTH}px - ${NAVBAR_WIDTH}px)`}
            h={`calc(100vh - ${HEADER_HEIGHT}px)`}
            sx={{
              display: "flex",
              justifyContent: "Center",
              alignItems: "center",
            }}
          >
            Something went wrong
          </Box>
        )}
        onError={(error, info) => {
          console.error("Error:", error);
          console.error("Info:", info);
        }}
        onReset={() => {
          resetTree();
        }}
      >
        {children}
      </ErrorBoundary>
    </AppShell>
  );
};
