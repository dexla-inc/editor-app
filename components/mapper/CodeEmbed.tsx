import { withComponentWrapper } from "@/hoc/withComponentWrapper";
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
    const {
      htmlCode: html,
      cssCode: css,
      jsCode: js,
      triggers,
      ...componentProps
    } = component.props ?? {};
    const {
      htmlCode = html,
      cssCode = css,
      jsCode = js,
    } = component.onLoad ?? {};
    const uniqueClass = `code-embed-${component.id}`;

    if (ref && "current" in ref && ref.current) {
      // Function to prefix CSS selectors
      const prefixCssSelectors = (css: string, prefix: string) => {
        return css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, (match) => {
          // Don't prefix @-rules
          return match.startsWith("@") ? match : `${prefix} ${match}`;
        });
      };
      const prefixedCss = prefixCssSelectors(cssCode, `.${uniqueClass}`);

      ref.current.innerHTML = `
          <style>${prefixedCss}</style>
          ${htmlCode}
          <script>${jsCode}</script>
        `;
    }

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
