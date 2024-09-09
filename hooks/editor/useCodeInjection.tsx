import { useCodeInjectionContext } from "@/contexts/CodeInjectionProvider";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isPreviewModeSelector } from "@/utils/componentSelectors";
import { EditableComponentMapper } from "@/utils/editor";
import merge from "lodash.merge";
import { useCallback, useEffect } from "react";

export const useCodeInjection = (
  ref: React.RefObject<HTMLIFrameElement>,
  component: EditableComponentMapper["component"],
  props: Record<string, any>,
) => {
  const isPreviewMode = isPreviewModeSelector(useEditorTreeStore.getState());

  const { handleSetVariable, handleGetVariable } = useCodeInjectionContext();

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
            // do nothing
          }
        });
      };

      applyHandlers(doc.documentElement);
    },
    [events],
  );

  const createScriptContent = useCallback((jsCode: string) => {
    const transformedJsCode = jsCode.replace(
      /(?:dexla\.setVariable\s*\(\s*(variables\[(?:\/\*[\s\S]*?\*\/\s*)?'[^']+'\](?:\.[.\w]+|\[[^\]]+\])*)\s*,)|(?<!['"`).\w])(variables\[(?:\/\*[\s\S]*?\*\/\s*)?'[^']+'\](?:\.[.\w]+|\[[^\]]+\])*)/g,
      (match, setVariableArg, standaloneVariable) => {
        if (setVariableArg) {
          // Case 1: dexla.setVariable function
          return `dexla.setVariable("${setVariableArg}", `;
        } else if (standaloneVariable) {
          // Case 2: Standalone variables
          return `await dexla.getVariable("${standaloneVariable}")`;
        }
        return match;
      },
    );

    return `
      (function(w) {
        const dexla = {
          setVariable: (variable, value) => {
            const variablePattern = /variables\\[s*(?:\\/\\*[\\s\\S]*?\\*\\/\\s*)?'(.*?)'\\s*\\]/g;
            const variableId = [...variable.matchAll(variablePattern)][0][1];
            w.postMessage({ type: 'SET_VARIABLE', params: {variableId, value} }, '*');
            w.parent.postMessage({ type: 'SET_VARIABLE', params: [variableId, value] }, '*');
          },
          getVariable: (variable) => {
            const [_, variableId, variablePath] = variable.match(/variables\\[(?:\\/\\*[\\s\\S]*?\\*\\/\\s*)?'([^']+)'\\](.*)/);

            return new Promise((resolve) => {
              const messageHandler = (event) => {
                if (event.data.type === 'GET_VARIABLE_RESPONSE' && event.data.variableId === variableId) {
                  w.removeEventListener('message', messageHandler);
                  resolve(event.data.value);
                }
              };
              w.addEventListener('message', messageHandler);
              w.parent.postMessage({ type: 'GET_VARIABLE', params: [variableId, variablePath] }, '*');
            });
          },
        };
        Object.freeze(dexla);

        (async () => {
          ${transformedJsCode}
        })();
      })(window);
    `;
  }, []);

  const injectContent = useCallback(
    (htmlCode: string, cssCode: string, jsCode?: string) => {
      if (!ref.current) return;
      ref.current.style.width = "100%";
      ref.current.style.border = "none";

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, "text/html");

      // Add CSS to the head
      const styleElement = doc.createElement("style");
      styleElement.textContent = cssCode;
      doc.head.appendChild(styleElement);

      // Add JS code to the body
      if (jsCode) {
        const scriptElement = doc.createElement("script");
        scriptElement.textContent = createScriptContent(jsCode);
        doc.body.appendChild(scriptElement);
      }

      // Write the modified HTML to the iframe
      ref.current.contentDocument?.open();
      ref.current.contentDocument?.write(doc.documentElement.outerHTML);
      ref.current.contentDocument?.close();

      !jsCode && applyEventHandlers(ref.current.contentDocument!);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref],
  );

  useEffect(() => {
    const { htmlCode, cssCode, jsCode } = component?.onLoad ?? {};
    let args: Parameters<typeof injectContent> = [htmlCode, cssCode];
    if (isPreviewMode) {
      args.push(jsCode);
    }

    injectContent(...args);
  }, [component, injectContent, isPreviewMode]);
};
