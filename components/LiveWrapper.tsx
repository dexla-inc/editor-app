import { useUserTheme } from "@/hooks/useUserTheme";
import { getProject } from "@/requests/projects/queries";
import { useEditorStore } from "@/stores/editor";
import { decodeSchema } from "@/utils/compression";
import createCache from "@emotion/cache";
import { Box, BoxProps, MantineProvider } from "@mantine/core";
import { useState, useEffect } from "react";

type Props = {
  projectId: string;
} & BoxProps;

export const LiveWrapper = ({ children, projectId, ...props }: Props) => {
  const [customCode, setCustomCode] = useState<any | null>(null);
  const theme = useUserTheme(projectId);

  const w = typeof window !== "undefined" ? window : undefined;
  const mountNode = w?.document.body;
  const insertionTarget = w?.document.head;

  mountNode?.setAttribute("style", `margin: 0px;`);

  const styleTag = document.createElement("style");
  styleTag.textContent = `* { box-sizing: border-box; }`;
  insertionTarget?.appendChild(styleTag);

  useEffect(() => {
    // add head custom code
    if (customCode?.headCode) {
      // check if head code already exists
      const existingHeadCode = w?.document.getElementById("footer-code");
      if (!existingHeadCode) {
        const scriptTag = w?.document.createElement("script");
        if (scriptTag) {
          scriptTag!.textContent = customCode.headCode;
          scriptTag!.setAttribute("id", "head-code");
          insertionTarget?.appendChild(scriptTag!);
        }
      }
    }

    // add footer custom code
    if (customCode?.footerCode) {
      // check if footer code already exists
      const existingFooterCode = w?.document.getElementById("footer-code");
      if (!existingFooterCode) {
        const scriptTag = w?.document.createElement("script");
        if (scriptTag) {
          scriptTag!.textContent = customCode.footerCode;
          scriptTag!.setAttribute("id", "footer-code");
          mountNode?.appendChild(scriptTag!);
        }
      }
    }
  }, [
    customCode?.footerCode,
    customCode?.headCode,
    insertionTarget,
    mountNode,
    w?.document,
  ]);

  useEffect(() => {
    const fetchProject = async () => {
      const project = await getProject(projectId);
      const customCode = project.customCode
        ? JSON.parse(decodeSchema(project.customCode))
        : undefined;
      if (customCode) {
        setCustomCode(customCode);
      }
    };

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (!theme) {
    return null;
  }

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
