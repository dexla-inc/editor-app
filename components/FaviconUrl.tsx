import { AssetsTextInput } from "@/components/AssetsTextInput";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { patchProject } from "@/requests/projects/mutations";
import { patchTheme } from "@/requests/themes/mutations";
import { PatchParams } from "@/requests/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";

export const FaviconUrl = () => {
  const [faviconUrl, setFaviconUrl] = useState("");
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
  const { data: project } = useProjectQuery(projectId);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPatchProject = useCallback(
    debounce(async (url) => {
      const patchParams = [
        {
          op: "replace",
          path: "/faviconUrl",
          value: url,
        },
      ] as PatchParams[];

      await patchTheme(projectId, patchParams);
    }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId],
  );

  const handleFaviconUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFaviconUrl(event.target.value);
    debouncedPatchProject(event.target.value);
  };

  useEffect(() => {
    if (project?.branding?.faviconUrl) {
      setFaviconUrl(project.branding.faviconUrl);
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
