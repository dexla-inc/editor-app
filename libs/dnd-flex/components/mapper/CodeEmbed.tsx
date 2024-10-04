import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useCodeInjection } from "@/hooks/editor/useCodeInjection";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, BoxProps } from "@mantine/core";
import { forwardRef, useRef, Suspense } from "react";

type Props = EditableComponentMapper & BoxProps;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CodeEmbedComponent = forwardRef<HTMLIFrameElement, Props>(
  (props, ref) => {
    return (
      <Suspense>
        {delay(1000).then(() => (
          <CodeEmbedComponentInner {...props} />
        ))}
      </Suspense>
    );
  },
);

const CodeEmbedComponentInner = ({
  component,
  shareableContent,
  renderTree,
  ...props
}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useCodeInjection(iframeRef, component, props);

  return <iframe ref={iframeRef} {...props} />;
};

CodeEmbedComponent.displayName = "CodeEmbed";

export const CodeEmbed = withComponentWrapper<Props>(CodeEmbedComponent);
