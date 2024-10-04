import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useCodeInjection } from "@/hooks/editor/useCodeInjection";
import { EditableComponentMapper } from "@/utils/editor";
import { BoxProps, Skeleton } from "@mantine/core";
import { forwardRef, useRef, Suspense, useState, useEffect } from "react";

type Props = EditableComponentMapper & BoxProps;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CodeEmbedComponent = forwardRef<HTMLIFrameElement, Props>(
  (props, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { style } = props;

    useEffect(() => {
      delay(1000).then(() => setIsLoaded(true));
    }, []);

    return (
      <Suspense>
        {isLoaded ? (
          <CodeEmbedComponentInner {...props} />
        ) : (
          <Skeleton
            height={style?.height || "100%"}
            width={style?.width || "100%"}
          />
        )}
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
