import { ICON_SIZE } from "@/utils/config";
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { PropsWithChildren, useEffect, useState } from "react";

type SidebarSectionProps = {
  id: string;
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  onClick?: (id: string) => void;
};

export function SidebarSection({
  id,
  icon: Icon,
  label,
  initiallyOpened,
  children,
  onClick,
}: PropsWithChildren<SidebarSectionProps>) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    initiallyOpened && setOpened(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSectionClick = () => {
    setOpened((o) => !o);
    onClick && onClick(id);
  };

  return (
    <>
      <UnstyledButton
        onClick={handleSectionClick}
        sx={{
          fontWeight: 500,
          display: "block",
          width: "100%",
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          color: theme.black,

          "&:hover": {
            backgroundColor: theme.colors.gray[1],
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
                transform: opened ? `none` : "rotate(-90deg)",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {children ? (
        <Collapse in={opened}>
          <Box px="md">{children}</Box>
        </Collapse>
      ) : null}
    </>
  );
}
