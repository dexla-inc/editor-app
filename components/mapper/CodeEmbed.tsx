import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useCodeInjection } from "@/hooks/editor/useCodeInjection";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, BoxProps, Skeleton } from "@mantine/core";
import { forwardRef, useState, useEffect, Suspense } from "react";

type Props = EditableComponentMapper & BoxProps;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CodeEmbedComponent = forwardRef<HTMLIFrameElement, Props>(
  (
    {
      component,
      shareableContent,
      style,
      sx,
      grid: { ChildrenWrapper },
      ...props
    },
    ref,
  ) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const injectedHtmlCode = useCodeInjection(
      ref as React.RefObject<HTMLIFrameElement>,
      component,
      props,
    );

    useEffect(() => {
      delay(1000).then(() => setIsLoaded(true));
    }, []);

    return (
      <Suspense>
        {isLoaded ? (
          <Box
            ref={ref}
            component="iframe"
            srcDoc={injectedHtmlCode}
            {...props}
            sx={sx}
            style={style}
          >
            <ChildrenWrapper />
          </Box>
        ) : (
          <Skeleton
            height={style?.height || "100%"}
            width={style?.width || "100%"}
          >
            <ChildrenWrapper />
          </Skeleton>
        )}
      </Suspense>
    );
  },
);

CodeEmbedComponent.displayName = "CodeEmbed";

export const CodeEmbed = withComponentWrapper<Props>(CodeEmbedComponent);
