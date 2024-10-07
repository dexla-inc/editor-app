import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useCodeInjection } from "@/hooks/editor/useCodeInjection";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, BoxProps } from "@mantine/core";
import { forwardRef, useRef } from "react";

type Props = EditableComponentMapper & BoxProps;

const CodeEmbedComponent = forwardRef<HTMLIFrameElement, Props>(
  ({ component, shareableContent, style, sx, ...props }, ref) => {
    const injectedHtmlCode = useCodeInjection(
      ref as React.RefObject<HTMLIFrameElement>,
      component,
      props,
    );

    return (
      <Box
        ref={ref}
        component="iframe"
        srcDoc={injectedHtmlCode}
        {...props}
        sx={sx}
        style={style}
      />
    );
  },
);

CodeEmbedComponent.displayName = "CodeEmbed";

export const CodeEmbed = withComponentWrapper<Props>(CodeEmbedComponent);
