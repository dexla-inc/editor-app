import { ProgressBar } from "@/components/ProgressBar";
import { useCustomCode } from "@/hooks/useCustomCode";
import { useUserTheme } from "@/hooks/useUserTheme";
import { Box, BoxProps, MantineProvider } from "@mantine/core";

type Props = {
  projectId: string;
} & BoxProps;

export const LiveWrapper = ({ children, projectId, ...props }: Props) => {
  const theme = useUserTheme(projectId);
  useCustomCode(projectId);

  if (!theme) {
    return null;
  }

  return (
    <MantineProvider withNormalizeCSS theme={theme} {...props}>
      <Box
        pos="relative"
        style={{
          minHeight: `100vh`,
        }}
        p={0}
      >
        <ProgressBar color={theme.colors.Primary[6]} />
        <Box id="iframe-content">{children}</Box>
      </Box>
    </MantineProvider>
  );
};
