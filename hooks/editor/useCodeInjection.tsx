import { useCodeInjectionContext } from "@/contexts/CodeInjectionProvider";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableStore } from "@/stores/variables";
import { isPreviewModeSelector } from "@/utils/componentSelectors";
import { EditableComponentMapper } from "@/utils/editor";
import merge from "lodash.merge";
import { useCallback, useEffect, useMemo } from "react";

export const useCodeInjection = (
  ref: React.RefObject<HTMLIFrameElement>,
  component: EditableComponentMapper["component"],
  props: Record<string, any>,
) => {
  const isPreviewMode = useMemo(
    () => isPreviewModeSelector(useEditorTreeStore.getState()),
    [],
  );

  const { handleSetVariable } = useCodeInjectionContext();

  const events = merge({}, component.props?.triggers, props);
  const applyEventHandlers = useCallback(
    (doc: Document) => {
      const applyHandlers = (element: Element) => {
        Object.entries(events)?.forEach(([eventName, handler]) => {
          try {
            element.addEventListener(
              eventName.substring(2).toLowerCase(),
              handler as EventListener,
            );
          } catch (error) {
            console.error("invalid event handler", error);
          }
        });
      };

      applyHandlers(doc.documentElement);
    },
    [events],
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
            w.parent.postMessage({ type: 'SET_VARIABLE', variableId, value }, '*');
          }
        };
        Object.freeze(dexla);
        ${transformedJsCode}
      })(window);
    `;
  }, []);

  const injectContent = useCallback(
    (htmlCode: string, cssCode: string, jsCode?: string) => {
      if (!ref.current) return;
      ref.current.style.width = "auto";
      ref.current.style.height = "auto";
      ref.current.style.border = "none";
      ref.current.contentDocument?.open();
      ref.current.contentDocument?.write(`
      <!DOCTYPE html>
      <head>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        ${jsCode ? `<script>${createScriptContent(jsCode)}</script>` : ""}
      </body>
    `);
      ref.current.contentDocument?.close();
      !jsCode && applyEventHandlers(ref.current.contentDocument!);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref],
  );

  useEffect(() => {
    const { htmlCode, cssCode, jsCode } = merge(
      {},
      component?.props,
      component?.onLoad,
    );
    let args: Parameters<typeof injectContent> = [htmlCode, cssCode];
    if (isPreviewMode) {
      args.push(jsCode);
    }

    injectContent(...args);
  }, [component, injectContent, isPreviewMode]);
};
