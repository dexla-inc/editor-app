import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useCodeInjection } from "@/hooks/editor/useCodeInjection";
import { EditableComponentMapper } from "@/utils/editor";
import { Box } from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef } from "react";

type Props = EditableComponentMapper & {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
};

const CodeEmbedComponent = forwardRef<HTMLDivElement, Props>(
  ({ component, ...props }, ref) => {
    const uniqueClass = `code-embed-${component.id}`;

    useCodeInjection(
      ref as React.RefObject<HTMLDivElement>,
      component,
      uniqueClass,
    );

    const { triggers, ...componentProps } = component.props ?? {};

    return (
      <Box
        className={uniqueClass}
        ref={ref}
        {...omit(props, ["style"])}
        {...triggers}
        {...componentProps}
      />
    );
  },
);

CodeEmbedComponent.displayName = "CodeEmbed";

export const CodeEmbed = withComponentWrapper<Props>(CodeEmbedComponent);
