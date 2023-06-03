import { AppShell, Box, Navbar, useMantineTheme } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Logo } from "@/components/Logo";
import { HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";

export const Shell = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();

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
              justifyContent: "space-between",
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
