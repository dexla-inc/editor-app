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

  const { handleSetVariable, handleGetVariables, variables } =
    useCodeInjectionContext();

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
      /dexla\.setVariable\s*\(\s*(variables\[(?:\/\*[\s\S]*?\*\/\s*)?'[^']+'\](?:\.[.\w]+|\[[^\]]+\])*)\s*,/g,
      (match, setVariableArg) => {
        // Only transform setVariable calls
        return `dexla.setVariable("${setVariableArg}", `;
      },
    );

    return `
      (function(w) {
        const variables = new Proxy({}, {
          get: (target, prop) => w.variables()[prop],
          set: (target, prop, value) => {
            w.variables()[prop] = value;
            w.postMessage({ type: 'SET_VARIABLE', params: [prop, value] }, '*');
            w.parent.postMessage({ type: 'SET_VARIABLE', params: [prop, value] }, '*');
          }
        });
        const dexla = {
          setVariable: (variable, value) => {
            const variablePattern = /variables\\[s*(?:\\/\\*[\\s\\S]*?\\*\\/\\s*)?'(.*?)'\\s*\\]/g;
            const variableId = [...variable.matchAll(variablePattern)][0][1];
            variables[variableId] = value;
          }
        };
        Object.freeze(dexla);

        ${transformedJsCode}
        
      })(window);
    `;
  }, []);

  const injectContent = useCallback(
    (htmlCode: string) => {
      if (!ref.current) return;
      ref.current.style.width = "100%";
      ref.current.style.border = "none";

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, "text/html");

      const scriptTag = doc.body.querySelector("script");
      if (scriptTag) {
        const originalScript = scriptTag.textContent || "";
        const newScriptContent = createScriptContent(originalScript);
        scriptTag.textContent = isPreviewMode ? newScriptContent : "";
      }

      // @ts-ignore
      ref.current.contentWindow!.variables = handleGetVariables;

      // Write the modified HTML to the iframe
      ref.current.contentDocument?.open();
      ref.current.contentDocument?.write(doc.documentElement.outerHTML);
      ref.current.contentDocument?.close();

      !isPreviewMode && applyEventHandlers(ref.current.contentDocument!);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref],
  );

  useEffect(() => {
    injectContent(component.onLoad?.htmlCode);
  }, [component, injectContent]);
};
