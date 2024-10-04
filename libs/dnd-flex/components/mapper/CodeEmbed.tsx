import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useCodeInjection } from "@/hooks/editor/useCodeInjection";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, BoxProps } from "@mantine/core";
import { forwardRef, useRef } from "react";

type Props = EditableComponentMapper & BoxProps;

const CodeEmbedComponent = forwardRef<HTMLIFrameElement, Props>(
  ({ component, shareableContent, renderTree, ...props }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    useCodeInjection(iframeRef, component, props);

    return <Box component="iframe" ref={iframeRef} {...props} />;
  },
);

CodeEmbedComponent.displayName = "CodeEmbed";

export const CodeEmbed = withComponentWrapper<Props>(CodeEmbedComponent);
