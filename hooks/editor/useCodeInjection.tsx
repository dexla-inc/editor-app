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

  const createScriptContent = useCallback((jsCode: string) => {
    const transformedJsCode = jsCode.replace(
      /dexla\.setVariable\s*\(\s*(variables\[(?:\/\*[\s\S]*?\*\/\s*)?'[^']+'\](?:\.[.\w]+|\[[^\]]+\])*)\s*,/g,
      (match, setVariableArg) => {
        return `dexla.setVariable("${setVariableArg}", `;
      },
    );

    return `
    (function(w) {
      let lastVariables = {};
      
      // Function to check if variables have changed
      const checkVariables = () => {
        const currentVars = w.variables();
        if (JSON.stringify(lastVariables) !== JSON.stringify(currentVars)) {
          lastVariables = Object.freeze({ ...currentVars });
          updateDOMWithVariables();
        }
        requestAnimationFrame(checkVariables);
      };

      const variables = new Proxy({}, {
        get: (target, prop) => w.variables()[prop],
        set: (target, prop, value) => {
          w.variables()[prop] = value;
          w.postMessage({ type: 'SET_VARIABLE', params: [prop, value] }, '*');
          w.parent.postMessage({ type: 'SET_VARIABLE', params: [prop, value] }, '*');
          return true;
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

      // Function that runs the script with latest values
      const updateDOMWithVariables = () => {
        ${transformedJsCode}
      };

      // Start watching for variable changes
      checkVariables();
      
      // Initial run
      updateDOMWithVariables();
    })(window);
  `;
  }, []);

  const injectEventHandlers = useCallback(() => {
    if (isPreviewMode || !ref.current || !ref.current.contentDocument) return;

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

    applyHandlers(ref.current.contentDocument.documentElement);
  }, [events, isPreviewMode, ref]);

  const injectedHtmlCode = useMemo(() => {
    if (!component.onLoad?.htmlCode) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(component.onLoad.htmlCode, "text/html");
    // Extract scripts
    const scripts: string[] = [];
    const scriptTags = doc.querySelectorAll("script:not([src])");

    scriptTags.forEach((scriptTag) => {
      let scriptContent = scriptTag.textContent || "";
      // Insert variables at the beginning of each script
      const newScriptContent = createScriptContent(scriptContent);
      scripts.push(newScriptContent);
      scriptTag.remove(); // Remove script tag from the document
    });

    // Inject scripts
    const scriptElement = doc.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.text = scripts.join("\n");
    doc.body.appendChild(scriptElement);

    return doc.documentElement.outerHTML;
  }, [component.onLoad?.htmlCode, createScriptContent]);

  // Inject variables into iframe
  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      ref.current.contentWindow!.variables = () => variables;
    }
  }, [ref, variables]);

  // Call injectEventHandlers after the content has been loaded
  useEffect(() => {
    if (ref.current) {
      ref.current.onload = injectEventHandlers;
    }
  }, [ref, injectEventHandlers]);

  return injectedHtmlCode;
};
