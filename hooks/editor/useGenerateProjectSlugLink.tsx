import { useEffect, useState } from "react";
import { useProjectQuery } from "./reactQuery/useProjectQuery";
import { generateProjectSlugLink } from "@/utils/common";
import { useParams } from "next/navigation";

const useGenerateProjectSlugLink = (slug: string) => {
  const { id: projectId, page } = useParams<{ id: string; page: string }>();

  const [url, setUrl] = useState<URL>();
  const [customDomain, setCustomDomain] = useState("");

  const { data: project } = useProjectQuery(projectId);

  useEffect(() => {
    if (project) {
      const fullDomain = project.subDomain
        ? `${project.subDomain}.${project.domain}`
        : project.domain;

      if (fullDomain) {
        setCustomDomain(fullDomain);
      }
    }
  }, [project]);

  useEffect(() => {
    if (projectId && page && slug) {
      const deployUrl = generateProjectSlugLink(projectId, customDomain, slug);
      setUrl(deployUrl);
    }
  }, [projectId, customDomain, page, slug]);

  return { url };
};

export default useGenerateProjectSlugLink;
