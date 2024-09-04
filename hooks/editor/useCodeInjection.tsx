import { useCodeInjectionContext } from "@/contexts/CodeInjectionProvider";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableStore } from "@/stores/variables";
import { isPreviewModeSelector } from "@/utils/componentSelectors";
import { EditableComponentMapper } from "@/utils/editor";
import { useCallback, useEffect, useMemo } from "react";

const prefixCssSelectors = (css: string, prefix: string) => {
  return css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, (match) => {
    return match.startsWith("@") ? match : `${prefix} ${match}`;
  });
};

export const useCodeInjection = (
  ref: React.RefObject<HTMLDivElement>,
  component: EditableComponentMapper["component"],
  uniqueClass: string,
) => {
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isPreviewMode = useMemo(
    () => isPreviewModeSelector(useEditorTreeStore.getState()),
    [],
  );

  const { handleSetVariable } = useCodeInjectionContext();

  const injectHtmlAndCss = useCallback(
    (htmlCode: string, cssCode: string) => {
      if (!ref.current) return;
      const prefixedCss = prefixCssSelectors(cssCode, `.${uniqueClass}`);
      ref.current.innerHTML = `
      <style>${prefixedCss}</style>
      ${htmlCode}
    `;
    },
    [ref, uniqueClass],
  );

  const createScriptContent = useCallback((jsCode: string) => {
    const variables = Object.entries(
      useVariableStore.getState().variableList,
    ).reduce(
      (acc, [id, variable]) => ({
        ...acc,
        [id]: variable.value ?? variable.defaultValue ?? undefined,
      }),
      {},
    );

    const transformedJsCode = jsCode.replace(
      /dexla\.setVariable\s*\(\s*([^,]+)\s*,/g,
      (match: any, p1: any) => `dexla.setVariable("${p1.trim()}",`,
    );

    return `
      (function(w) {
        const variables = ${JSON.stringify(variables)};
        const dexla = {
          setVariable: (variable, value) => {
            const variablePattern = /variables\\[s*(?:\\/\\*[\\s\\S]*?\\*\\/\\s*)?'(.*?)'\\s*\\]/g;
            const variableId = [...variable.matchAll(variablePattern)][0][1];
            w.postMessage({ type: 'SET_VARIABLE', variableId, value }, '*');
          }
        };
        Object.freeze(dexla);
        ${transformedJsCode}
      })(window);
    `;
  }, []);

  const injectJavaScript = useCallback(
    (jsCode: string) => {
      if (!ref.current) return;
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.textContent = createScriptContent(jsCode);
      ref.current.appendChild(script);
    },
    [ref, createScriptContent],
  );

  useEffect(() => {
    const { htmlCode, cssCode, jsCode } =
      component?.onLoad ?? component?.props ?? {};

    injectHtmlAndCss(htmlCode, cssCode);

    if (!isPreviewMode) return;

    injectJavaScript(jsCode);
  }, [component, injectHtmlAndCss, injectJavaScript, isPreviewMode]);
};
