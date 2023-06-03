import { ICON_SIZE } from "@/utils/config";
import {
  useMantineTheme,
  UnstyledButton,
  Group,
  Box,
  Text,
  ThemeIcon,
  Collapse,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { PropsWithChildren, useState } from "react";

interface NavbarSectionProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function NavbarSection({
  icon: Icon,
  label,
  initiallyOpened,
  children,
}: PropsWithChildren<NavbarSectionProps>) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(initiallyOpened || false);

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        sx={{
          fontWeight: 500,
          display: "block",
          width: "100%",
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          color: theme.black,

          "&:hover": {
            backgroundColor: theme.colors.gray[0],
            color: theme.black,
          },
        }}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon color="teal" variant="light" size={30}>
              <Icon size={ICON_SIZE} />
            </ThemeIcon>
            <Text size="xs" ml="md">
              {label}
            </Text>
          </Box>
          {children && (
            <IconChevronDown
              size={ICON_SIZE}
              stroke={1.5}
              style={{
                transition: "transform 200ms ease",
                transform: opened ? `rotate(-180deg)` : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {children ? (
        <Collapse in={opened}>
          <Box p="md">{children}</Box>
        </Collapse>
      ) : null}
    </>
  );
}
