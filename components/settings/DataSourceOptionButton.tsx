import { Paper, Stack, Text, Title, UnstyledButton } from "@mantine/core";
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
  return (
    <UnstyledButton
      component={Link}
      href={href}
      style={{
        display: "flex",
        flex: 1,
        cursor: "pointer",
      }}
    >
      <Paper p="xl" radius="sm" shadow="xs" sx={{ width: "100%" }}>
        <Stack align="center">
          {logoUrl && (
            <Image src={logoUrl} alt={title} width={200} height={200} />
          )}
          <Title>{title}</Title>
          <Stack spacing={0} align="center">
            <Text>{description}</Text>
            <Text size="sm" c="dimmed">
              {caption}
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </UnstyledButton>
  );
}
