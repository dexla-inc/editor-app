import { AssetsTextInput } from "@/components/AssetsTextInput";
import { useProjectQuery } from "@/hooks/reactQuery/useProjectQuery";
import { patchProject } from "@/requests/projects/mutations";
import { PatchParams } from "@/requests/types";
import { useEditorStore } from "@/stores/editor";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";

export const FaviconUrl = () => {
  const [faviconUrl, setFaviconUrl] = useState("");
  const projectId = useEditorStore((state) => state.currentProjectId) as string;
  const { data: project } = useProjectQuery(projectId);

  const debouncedPatchProject = useCallback(
    debounce(async (url) => {
      const patchParams = [
        {
          op: "replace",
          path: "/faviconUrl",
          value: url,
        },
      ] as PatchParams[];

      await patchProject(projectId, patchParams);
    }, 500),
    [projectId],
  );

  const handleFaviconUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFaviconUrl(event.target.value);
    debouncedPatchProject(event.target.value);
  };

  useEffect(() => {
    if (project?.faviconUrl) {
      setFaviconUrl(project.faviconUrl);
    }
  }, [project]);

  return (
    <AssetsTextInput
      label="Favicon"
      placeholder="https://example.com/favicon.ico"
      value={faviconUrl}
      onChange={handleFaviconUrlChange}
    />
  );
};
