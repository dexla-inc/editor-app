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
      if (!ref.current || !htmlCode) return;
      ref.current.style.width = "100%";
      ref.current.style.border = "none";

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, "text/html");

      // Extract scripts
      let combinedScriptContent = "";
      const scriptTags = doc.querySelectorAll("script");
      scriptTags.forEach((scriptTag) => {
        const scriptContent = scriptTag.textContent || "";
        combinedScriptContent += scriptContent + "\n";
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

        // Apply event handlers if not in preview mode
        if (!isPreviewMode) {
          applyEventHandlers(iframeDoc);
        }

        // Remove existing script with the specific ID if it exists
        const existingScript = iframeDoc.getElementById("injected-script");
        if (existingScript) {
          existingScript.remove();
        }

        // Create and inject the new script
        const newScriptContent = createScriptContent(combinedScriptContent);
        const scriptElement = iframeDoc.createElement("script");
        scriptElement.id = "injected-script";
        scriptElement.type = "text/javascript";
        scriptElement.defer = true;
        scriptElement.text = newScriptContent;

        // Deprioritize script loading by using requestIdleCallback
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            iframeDoc.body.appendChild(scriptElement);
          });
        } else {
          // Fallback for browsers that don't support requestIdleCallback
          setTimeout(() => {
            iframeDoc.body.appendChild(scriptElement);
          }, 0);
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
        // Remove the onload event listener
        ref.current.onload = null;

        // Clear the iframe content
        if (ref.current.contentDocument) {
          ref.current.contentDocument.head.innerHTML = "";
          ref.current.contentDocument.body.innerHTML = "";
        }

        // Remove any event listeners added to the iframe's document
        if (ref.current.contentWindow) {
          ref.current.contentWindow.removeEventListener("message", () => {});
        }

        // ref.current.remove();
      }
    };
  }, [component, injectContent, ref]);
};
