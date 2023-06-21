import { Logo } from "@/components/Logo";
import { HEADER_HEIGHT } from "@/utils/config";
import { Anchor, AppShell, AppShellProps, Group, Header } from "@mantine/core";

export const Shell = ({ children, navbar, aside }: AppShellProps) => {
  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT}>
          <Group h={HEADER_HEIGHT} pl="lg">
            <Anchor href="/">
              <Logo />
            </Anchor>
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
