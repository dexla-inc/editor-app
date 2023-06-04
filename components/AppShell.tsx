import {
  AppShell,
  Aside,
  Header,
  Navbar,
  ScrollArea,
  Group,
  Box,
  AppShellProps,
} from "@mantine/core";
import { Logo } from "@/components/Logo";
import { HEADER_HEIGHT } from "@/utils/config";

export const Shell = ({ children, navbar, aside }: AppShellProps) => {
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
      navbar={navbar}
      aside={aside}
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
