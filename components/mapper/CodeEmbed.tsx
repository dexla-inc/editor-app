import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isPreviewModeSelector } from "@/utils/componentSelectors";
import { EditableComponentMapper } from "@/utils/editor";
import { Box } from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, useEffect } from "react";

type Props = EditableComponentMapper & {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
};

// Function to prefix CSS selectors
const prefixCssSelectors = (css: string, prefix: string) => {
  return css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, (match) => {
    // Don't prefix @-rules
    return match.startsWith("@") ? match : `${prefix} ${match}`;
  });
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
    useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        const prefixedCss = prefixCssSelectors(cssCode, `.${uniqueClass}`);
        const isPreviewMode = isPreviewModeSelector(
          useEditorTreeStore.getState(),
        );

        ref.current.innerHTML = `
          <style>${prefixedCss}</style>
          ${htmlCode}
        `;

        // Create and append the script element
        if (isPreviewMode) {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.textContent = `
          (function() {
            ${jsCode}
          })();
        `;
          ref.current.appendChild(script);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, component?.onLoad]);

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
