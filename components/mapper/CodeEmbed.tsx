import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useCodeInjection } from "@/hooks/editor/useCodeInjection";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, BoxProps } from "@mantine/core";
import { forwardRef } from "react";

type Props = EditableComponentMapper & BoxProps;

const CodeEmbedComponent = forwardRef<HTMLIFrameElement, Props>(
  ({ component, ...props }, ref) => {
    useCodeInjection(ref as React.RefObject<HTMLIFrameElement>, component);

    const { triggers, htmlCode, cssCode, jsCode, ...componentProps } =
      component.props ?? {};

    return (
      <Box
        component="iframe"
        ref={ref}
        {...triggers}
        {...props}
        {...componentProps}
      />
    );
  },
);

CodeEmbedComponent.displayName = "CodeEmbed";

export const CodeEmbed = withComponentWrapper<Props>(CodeEmbedComponent);
