import {
  AppShell,
  Box,
  Card,
  Group,
  Navbar,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { PropsWithChildren, useState } from "react";
import { Logo } from "@/components/Logo";
import { HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import { DraggableComponent } from "@/components/DraggableComponent";

export const Shell = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<"components" | "layers">(
    "components"
  );

  return (
    <AppShell
      fixed
      padding={0}
      navbar={
        <Navbar
          hiddenBreakpoint="md"
          width={{ base: NAVBAR_WIDTH }}
          sx={{
            [theme.fn.smallerThan("md")]: {
              height: `calc(100% - ${HEADER_HEIGHT}px)`,
            },
          }}
        >
          <Navbar.Section
            sx={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              h={HEADER_HEIGHT}
              px="lg"
              display="flex"
              sx={{
                borderBottom: `1px solid ${theme.colors.gray[2]}`,
                alignItems: "center",
              }}
            >
              <Logo />
            </Box>
            <Stack p="lg">
              <SegmentedControl
                size="xs"
                value={activeTab}
                onChange={(value) => setActiveTab(value as any)}
                data={[
                  { label: "Components", value: "components" },
                  { label: "Layers", value: "layers" },
                ]}
              />
              {activeTab === "components" && (
                <Stack>
                  <DraggableComponent id="Text">
                    <Text size="xs">Text</Text>
                  </DraggableComponent>
                </Stack>
              )}
              {activeTab === "layers" && (
                <Stack>
                  <Text size="xs">Layers</Text>
                </Stack>
              )}
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
      styles={{
        main: {
          minHeight: "var(--vh, 100vh)",
          paddingLeft: "var(--mantine-navbar-width, 0px)",
        },
      }}
    >
      {children}
    </AppShell>
  );
};
