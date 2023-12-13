import { useUserTheme } from "@/hooks/useUserTheme";
import { useEditorStore } from "@/stores/editor";
import createCache from "@emotion/cache";
import { Box, BoxProps, MantineProvider } from "@mantine/core";

type Props = {
  projectId: string;
} & BoxProps;

export const LiveWrapper = ({ children, projectId, ...props }: Props) => {
  const theme = useEditorStore((state) => state.theme);
  useUserTheme(projectId);

  const w = typeof window !== "undefined" ? window : undefined;
  const mountNode = w?.document.body;
  const insertionTarget = w?.document.head;

  mountNode?.setAttribute("style", `margin: 0px;`);

  const styleTag = document.createElement("style");
  styleTag.textContent = `* { box-sizing: border-box; }`;
  insertionTarget?.appendChild(styleTag);

  return (
    <MantineProvider
      withNormalizeCSS
      theme={theme}
      emotionCache={createCache({
        container: insertionTarget,
        key: "live-canvas",
      })}
      {...props}
    >
      <Box id="iframe-content">{children}</Box>
    </MantineProvider>
  );
};
