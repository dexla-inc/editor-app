import { ProgressBar } from "@/components/ProgressBar";
import { useCustomCode } from "@/hooks/useCustomCode";
import { ProjectResponse } from "@/requests/projects/types";
import { useThemeStore } from "@/stores/theme";
import { Box, BoxProps, MantineProvider } from "@mantine/core";

type Props = {
  project: ProjectResponse;
} & BoxProps;

export const LiveWrapper = ({ children, project, ...props }: Props) => {
  const theme = useThemeStore((state) => state.theme);
  useCustomCode(project);
  console.log("LiveWrapper", props);

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
