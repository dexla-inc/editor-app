import { createProject } from "@/requests/projects/mutations";
import { useProjectListQuery } from "./reactQuery/useProjectListQuery";
import { useEffect } from "react";
import { useAppStore } from "@/stores/app";

export const useCreateTemplateProject = (orgId: string) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const {
    data: projectsQuery,
    isFetched,
    invalidate,
  } = useProjectListQuery(orgId);

  useEffect(() => {
    if (isFetched && projectsQuery?.results?.length === 0) {
      const createTemplateProject = async () => {
        try {
          startLoading({
            id: "creating-template-project",
            title: "Creating Starter Project",
            message: "Wait while we create your starter project",
          });

          const templateId = process.env
            .NEXT_PUBLIC_DEXLA_TEMPLATE_PROJECT_ID as string;

          await createProject({
            copyFrom: {
              id: templateId,
              type: "TEMPLATE",
            },
            friendlyName: "Starter Project",
            companyId: orgId,
          });

          invalidate();
        } catch (error: any) {
          stopLoading({
            id: "creating-template-project",
            title: "Creating Starter Failed",
            message: error.message,
            isError: true,
          });
        } finally {
          stopLoading({
            id: "creating-template-project",
            title: "Starter Project Created",
            message: "Your starter project is ready for you, enjoy!",
          });
        }
      };

      createTemplateProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, orgId]);
};
