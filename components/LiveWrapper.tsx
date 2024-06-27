import { useCustomCode } from "@/hooks/editor/useCustomCode";
import { ProjectResponse } from "@/requests/projects/types";
import { useThemeStore } from "@/stores/theme";
import { Box, BoxProps, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { MantineGlobal } from "@/components/MantineGlobal";

type Props = {
  project: ProjectResponse;
} & BoxProps;

export const LiveWrapper = ({ children, project }: Props) => {
  const theme = useThemeStore((state) => state.theme);
  useCustomCode(project);

  if (!theme) {
    return null;
  }

  return (
    <MantineProvider theme={theme} withNormalizeCSS>
      <MantineGlobal isLive />
      <Notifications />
      <Box
        pos="relative"
        style={{
          minHeight: `100vh`,
        }}
        p={0}
      >
        <Box id="iframe-content">{children}</Box>
      </Box>
    </MantineProvider>
  );
};
