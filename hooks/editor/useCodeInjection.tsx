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
      Object.entries(events)?.forEach(([eventName, handler]) => {
        try {
          doc.documentElement.addEventListener(
            eventName.substring(2).toLowerCase(),
            handler as EventListener,
          );
        } catch (error) {
          // Handle or log error if necessary
        }
      });
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

      // @ts-ignore
      ref.current.contentWindow!.variables = () => variables;

      // Write the initial HTML content without scripts
      ref.current.contentDocument?.open();
      ref.current.contentDocument?.write(
        doc.documentElement.outerHTML.replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          "",
        ),
      );
      ref.current.contentDocument?.close();

      // Once the iframe content is loaded, inject scripts
      ref.current.onload = () => {
        const iframeDoc = ref.current?.contentDocument;
        if (iframeDoc) {
          injectScripts(iframeDoc);
          if (!isPreviewMode) {
            applyEventHandlers(iframeDoc);
          }
        }
      };
    },
    [injectScripts, isPreviewMode, applyEventHandlers, variables],
  );

  useEffect(() => {
    injectContent(component.onLoad?.htmlCode);
  }, [component, injectContent]);
};
