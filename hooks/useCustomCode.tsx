import { ProjectResponse } from "@/requests/projects/types";
import { decodeSchema } from "@/utils/compression";
import { useEffect } from "react";

type CustomCode = {
  headCode: string;
  footerCode: string;
};

const extractScripts = (code: string, targetArray: string[]) => {
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(code)) !== null) {
    targetArray.push(match[1]);
  }
};

const injectScripts = (scripts: string[], container: HTMLElement) => {
  scripts.forEach((scriptContent) => {
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.defer = true; // Defer is only effective for external scripts
    scriptTag.textContent = scriptContent;
    container.appendChild(scriptTag);
  });
};

export const useCustomCode = (project: ProjectResponse) => {
  useEffect(() => {
    if (project && project.customCode) {
      const customCode = JSON.parse(
        decodeSchema(project.customCode),
      ) as CustomCode;

      // Initialize arrays to hold scripts for head and body
      const headScripts: string[] = [];
      const bodyScripts: string[] = [];

      // Extract scripts from customCode
      extractScripts(customCode.headCode, headScripts);
      extractScripts(customCode.footerCode, bodyScripts);

      // Inject scripts
      injectScripts(headScripts, document.head);
      injectScripts(bodyScripts, document.body);
    }
  }, [project]);
};
