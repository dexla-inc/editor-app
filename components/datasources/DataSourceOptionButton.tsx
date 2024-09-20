import { BINDER_BACKGROUND, BUTTON_HOVER, FLEX_HOVER } from "@/utils/branding";
import {
  Card,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  logoUrl: string;
  description: string;
  caption: string;
  href: string;
};

export default function MantineStyledButton({
  title,
  logoUrl,
  description,
  caption,
  href,
}: Props) {
  const theme = useMantineTheme();
  return (
    <UnstyledButton
      component={Link}
      href={href}
      sx={{
        display: "flex",
        flex: 1,
        cursor: "pointer",
      }}
    >
      <Card
        p="xl"
        radius="sm"
        shadow="xs"
        sx={{
          width: "100%",
          "&:hover": { backgroundColor: BINDER_BACKGROUND },
        }}
      >
        <Stack align="center">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={title}
              width={200}
              height={200}
              style={{
                background: "white",
                padding: theme.spacing.md,
                borderRadius: theme.radius.md,
              }}
            />
          )}
          <Title order={2}>{title}</Title>
          <Stack spacing={0}>
            <Text align="center">{description}</Text>
            <Text size="sm" c="dimmed" align="center">
              {caption}
            </Text>
          </Stack>
        </Stack>
      </Card>
    </UnstyledButton>
  );
}
