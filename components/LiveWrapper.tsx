import { useCustomCode } from "@/hooks/editor/useCustomCode";
import { ProjectResponse } from "@/requests/projects/types";
import { useThemeStore } from "@/stores/theme";
import { Box, BoxProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

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
    <>
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
    </>
  );
};
