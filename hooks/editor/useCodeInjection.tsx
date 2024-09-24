import { useCodeInjectionContext } from "@/contexts/CodeInjectionProvider";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableStore } from "@/stores/variables";
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
  const variables = useVariableStore((state) =>
    Object.values(state?.variableList ?? {}).reduce(
      (curr, item) => {
        if (item.id) {
          curr[item.id] = item?.value ?? item?.defaultValue ?? undefined;
        }

        return curr;
      },
      {} as Record<string, any>,
    ),
  );

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

  const injectScripts = useCallback(
    (doc: Document) => {
      if (!doc) return;

      const scriptTags = doc.querySelectorAll("script");

      scriptTags.forEach((scriptTag) => {
        const originalJs = scriptTag.textContent || "";
        const newScriptContent = isPreviewMode
          ? createScriptContent(originalJs)
          : ""; // Remove scripts in non-preview mode

        if (isPreviewMode) {
          const newScript = doc.createElement("script");
          newScript.type = "text/javascript";
          newScript.textContent = newScriptContent;
          scriptTag.replaceWith(newScript);
        } else {
          scriptTag.remove();
        }
      });

      // Append custom script if not in preview mode
      if (!isPreviewMode) {
        Object.freeze({});
      }
    },
    [createScriptContent, isPreviewMode],
  );

  const injectContent = useCallback(
    (htmlCode: string) => {
      if (!ref.current) return;
      ref.current.style.width = "100%";
      ref.current.style.border = "none";

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, "text/html");

      // Extract scripts
      const scripts: string[] = [];
      const scriptTags = doc.querySelectorAll("script");
      scriptTags.forEach((scriptTag) => {
        const scriptContent = scriptTag.textContent || "";
        const newScriptContent = createScriptContent(scriptContent);
        scripts.push(newScriptContent);
        scriptTag.remove(); // Remove script tag from the document
      });

      // Set variables in the iframe's window
      // @ts-ignore
      ref.current.contentWindow!.variables = () => variables;

      const iframeDoc = ref.current.contentDocument;
      if (iframeDoc) {
        // Clear existing content
        iframeDoc.head.innerHTML = "";
        iframeDoc.body.innerHTML = "";

        // Append new content
        iframeDoc.head.append(...doc.head.childNodes);
        iframeDoc.body.append(...doc.body.childNodes);

        // Inject scripts
        scripts.forEach((scriptContent) => {
          const scriptElement = iframeDoc.createElement("script");
          scriptElement.type = "text/javascript";
          scriptElement.text = scriptContent;
          iframeDoc.body.appendChild(scriptElement);
        });

        // Apply event handlers if not in preview mode
        if (!isPreviewMode) {
          applyEventHandlers(iframeDoc);
        }
      }
    },
    [ref, createScriptContent, variables, isPreviewMode, applyEventHandlers],
  );

  useEffect(() => {
    injectContent(component.onLoad?.htmlCode);

    // Cleanup function
    return () => {
      if (ref.current) {
        ref.current.onload = null;
      }
    };
  }, [component, injectContent]);
};
