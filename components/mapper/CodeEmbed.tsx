import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Box } from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, useEffect } from "react";

type Props = EditableComponentMapper & {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
};

const CodeEmbedComponent = forwardRef<HTMLDivElement, Props>(
  ({ component, ...props }, ref) => {
    const { htmlCode, cssCode, jsCode, triggers, ...componentProps } =
      component.props ?? {};
    useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.innerHTML = `
          <style>${cssCode}</style>
          ${htmlCode}
          <script>${jsCode}</script>
        `;
      }
    }, [htmlCode, cssCode, jsCode, ref]);

    return (
      <Box
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
