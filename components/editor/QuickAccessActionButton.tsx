import { BINDER_BACKGROUND, BORDER_COLOR } from "@/utils/branding";
import {
  UnstyledButton,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";

type Props = {
  subtitle: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
  onClick?: () => void;
} & React.ComponentProps<typeof UnstyledButton>;

export const QuickAccessActionButton = ({
  subtitle,
  caption,
  imageSrc,
  imageAlt,
  onClick,
  ...props
}: Props) => {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
      onClick={onClick}
      sx={{
        width: "fit-content",
        backgroundColor: BINDER_BACKGROUND,
        "&:hover": {
          backgroundColor: BORDER_COLOR,
          transition: "background-color 0.1s",
        },
        borderRadius: theme.radius.sm,
      }}
      {...props}
    >
      <Stack p="md">
        <Image src={imageSrc} alt={imageAlt} width={220} />
        <Stack align="center">
          <Text>{subtitle}</Text>
          <Text size="xs" color="dimmed">
            {caption}
          </Text>
        </Stack>
      </Stack>
    </UnstyledButton>
  );
};
