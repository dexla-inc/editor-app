import {
  AppShell,
  Aside,
  Header,
  Navbar,
  ScrollArea,
  useMantineTheme,
  Group,
  Box,
} from "@mantine/core";
import { PropsWithChildren } from "react";
import { Logo } from "@/components/Logo";
import { HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import { EditorNavbarSections } from "./EditorNavbarSections";

export const Shell = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT}>
          <Group h={HEADER_HEIGHT} p="lg">
            <Logo />
          </Group>
        </Header>
      }
      navbar={
        <Navbar
          width={{ base: NAVBAR_WIDTH }}
          sx={{
            height: `calc(100% - ${HEADER_HEIGHT}px)`,
          }}
        >
          <Navbar.Section grow component={ScrollArea}>
            <Box
              sx={{
                paddingTop: theme.spacing.xl,
                paddingBottom: theme.spacing.xl,
              }}
            >
              <EditorNavbarSections />
            </Box>
          </Navbar.Section>
        </Navbar>
      }
      styles={{
        main: {
          minHeight: "var(--vh, 100vh)",
          paddingLeft: "var(--mantine-navbar-width, 0px)",
        },
      }}
      aside={
        <Aside
          width={{ base: NAVBAR_WIDTH }}
          sx={{
            height: `calc(100% - ${HEADER_HEIGHT}px)`,
          }}
        >
          Aside
        </Aside>
      }
    >
      {children}
    </AppShell>
  );
};
