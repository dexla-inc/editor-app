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

type BaseProps = {
  title: string;
  logoUrl: string;
  description: string;
  caption: string;
};

type WithHref = BaseProps & {
  href: string;
  onClick?: () => void;
};

type WithOnClick = BaseProps & {
  href?: undefined;
  onClick: () => void;
};

type Props = WithHref | WithOnClick;

export default function MantineStyledButton({
  title,
  logoUrl,
  description,
  caption,
  href,
  onClick,
}: Props) {
  const theme = useMantineTheme();
  return (
    <UnstyledButton
      component={href ? "a" : "button"}
      {...(href ? { href } : undefined)}
      {...(onClick ? { onClick } : undefined)}
      sx={{
        display: "flex",
        flex: 1,
        cursor: "pointer",
        width: "100%",
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
