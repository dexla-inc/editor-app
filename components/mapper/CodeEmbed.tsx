import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useCodeInjection } from "@/hooks/editor/useCodeInjection";
import { EditableComponentMapper } from "@/utils/editor";
import { Box } from "@mantine/core";
import { forwardRef } from "react";

type Props = EditableComponentMapper & {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
};

const CodeEmbedComponent = forwardRef<HTMLIFrameElement, Props>(
  ({ component, ...props }, ref) => {
    useCodeInjection(ref as React.RefObject<HTMLIFrameElement>, component);

    const { triggers, htmlCode, cssCode, jsCode, ...componentProps } =
      component.props ?? {};

    return (
      <Box {...triggers} {...props} {...componentProps}>
        <iframe ref={ref} />
      </Box>
    );
  },
);

CodeEmbedComponent.displayName = "CodeEmbed";

export const CodeEmbed = withComponentWrapper<Props>(CodeEmbedComponent);
