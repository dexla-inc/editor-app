import { InformationAlert } from "@/components/Alerts";
import BackButton from "@/components/BackButton";
import { Icon } from "@/components/Icon";
import NextButton from "@/components/NextButton";
import {
  createDataSource,
  createDataSourceEndpoint,
} from "@/requests/datasources/mutations";
import { createPageList, createPages } from "@/requests/pages/mutations";
import { PageAIResponse, PageBody } from "@/requests/pages/types";
import { createVariable } from "@/requests/variables/mutations";
import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { GRAY_WHITE_COLOR } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import {
  NextStepperClickEvent,
  PreviousStepperClickEvent,
} from "@/types/dashboardTypes";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Textarea,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus, IconSparkles } from "@tabler/icons-react";
import { SetStateAction } from "react";
import slugify from "slugify";

export interface PagesStepProps
  extends PreviousStepperClickEvent,
    NextStepperClickEvent {
  projectId: string;
  pages: PageAIResponse[];
  setPages: (value: SetStateAction<PageAIResponse[]>) => void;
  hasPagesCreated: boolean;
  setHasPagesCreated: (value: boolean) => void;
  setHomePageId: (value: string) => void;
  description: string;
  industry: string;
}

export default function PagesStep({
  prevStep,
  nextStep,
  projectId,
  pages,
  setPages,
  hasPagesCreated,
  setHasPagesCreated,
  setHomePageId,
  description,
  industry,
}: PagesStepProps) {
  const resetTree = useEditorTreeStore((state) => state.resetTree);
  const theme = useMantineTheme();
  // const initiallPageGeneration = useRef(false);
  // const updatePage = (index: number, value: string) => {
  //   const updatedPages = [...pages];
  //   updatedPages[index] = { name: value, description: "A simple page" };
  //   setPages(updatedPages);
  // };

  const addEmptyPage = () => {
    setPages((oldPages) => [...oldPages]);
  };

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const startLoading = useAppStore((state) => state.startLoading);

  const handlePageNamesGeneration = async (pageCount?: string) => {
    startLoading({
      id: "creating-pages",
      title: "Creating Pages",
      message: "Wait while your pages are being created",
    });

    const existingPageNames = pages.map((page) => page.name).join(",");

    const newPageList = await createPageList(
      projectId,
      description,
      industry,
      pageCount,
      existingPageNames,
    );

    setPages((oldPages) => [...oldPages, ...newPageList]);

    stopLoading({
      id: "creating-pages",
      title: "Pages Created",
      message: "Your pages have been created",
    });
  };

  // useEffect(() => {

  //   if (!initiallPageGeneration.current) {
  //     handlePageNamesGeneration();
  //     initiallPageGeneration.current = true;
  //   }
  // }, [projectId, setPages, startLoading, stopLoading]);

  const createManyPages = async (projectId: string) => {
    try {
      resetTree();
      setIsLoading(true);
      startLoading({
        id: "creating-pages",
        title: "Creating Pages",
        message: "Wait while your pages are being created",
      });

      const createdPages = await createPages(
        pages.map((page, index) => {
          return {
            title: page.name,
            slug: slugify(page.name),
            description: page.features.join(", "),
            isHome: index === 0,
            authenticatedOnly: false,
          } as PageBody;
        }) as PageBody[],
        projectId,
      );

      const baseUrl = "https://visnduvexezenksqpvmo.supabase.co/rest/v1/";

      const dataSource = await createDataSource(projectId, {
        name: "Example API",
        baseUrl,
        environment: "staging",
        type: "API",
      });

      const projectResponse = await fetch(`/api/project/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const projectData = await projectResponse.json();

      const exampleResponse = JSON.stringify(projectData.data, null, 2);
      await createDataSourceEndpoint(projectId, dataSource.id, {
        dataSourceId: dataSource.id,
        description: "Get Entity Data",
        methodType: "GET",
        relativeUrl: "Project",
        headers: [
          {
            required: true,
            name: "apikey",
            type: "string",
            description: "",
            value:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc25kdXZleGV6ZW5rc3Fwdm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc3NzM3NjksImV4cCI6MjAxMzM0OTc2OX0.BtdpJTGNBGIEM84dwXL_4khMNA0EjBeXeg2RbrmtOLA",
            manuallyAdded: true,
          },
        ],
        parameters: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "",
            value: "eq.263f4aa3ce574cf3a8996f8f28c3b24a",
            location: "Query",
            manuallyAdded: true,
          },
          {
            name: "select",
            type: "string",
            required: true,
            description: "",
            value: "data",
            location: "Query",
            manuallyAdded: true,
          },
        ],
        requestBody: [],
        mediaType: "application/json",
        withCredentials: null,
        exampleResponse,
        errorExampleResponse: "",
        isServerRequest: false,
        baseUrl,
      });

      await createVariable(projectId, {
        name: "GET Project Data",
        type: "OBJECT",
        defaultValue: exampleResponse,
        isGlobal: false,
      });

      setHomePageId(createdPages.homePageId);
      setHasPagesCreated(true);
      stopLoading({
        id: "creating-pages",
        title: "Pages Created",
        message: "Your pages have been created",
      });
      setIsLoading(false);
      return createdPages;
    } catch (error) {
      console.error({ error });
      stopLoading({
        id: "creating-pages",
        title: "Error Creating Pages",
        message: "There was an error creating your pages",
      });
    }
  };

  const deletePage = (pageToRemove: string) => {
    setPages((pages) => pages.filter((page) => page.name !== pageToRemove));
  };

  const hasPageNames = pages.length > 0;

  return (
    <Stack spacing={40} my={25}>
      <Stack spacing="lg" maw={600}>
        {hasPageNames ? (
          pages.map(({ name, features }, index) => {
            const isLastItem = index === pages.length - 1;
            return (
              <>
                {/* Added div with key */}
                <Stack
                  sx={(theme) => ({
                    border: `1px solid ${theme.colors.gray[2]}`,
                    borderRadius: theme.radius.sm,
                  })}
                  pb="sm"
                >
                  <Group
                    position="apart"
                    {...(theme.colorScheme === "dark"
                      ? {}
                      : { bg: GRAY_WHITE_COLOR })}
                    p="sm"
                    sx={(theme) => ({
                      borderRadius: theme.radius.sm,
                    })}
                  >
                    <Text fw={500}>Page {index + 1}</Text>
                    <ActionIcon
                      onClick={() => deletePage(name)}
                      color="red"
                      radius="xl"
                    >
                      <Icon name="IconTrash" />
                    </ActionIcon>
                  </Group>
                  <TextInput
                    value={name}
                    label="Page name"
                    placeholder="Page name"
                    mx="sm"
                  />
                  <Textarea
                    value={features}
                    label="Features"
                    autosize
                    mx="sm"
                  />
                </Stack>
                {/* {!isLastItem && <Divider color="gray.2" />} */}
              </>
            );
          })
        ) : (
          <InformationAlert
            title="Hit Generate pages"
            text="We'll generate some pages and its functionality for you to get started. You can change this later."
          />
        )}
      </Stack>

      <Flex gap="lg">
        {hasPageNames && (
          <>
            <Tooltip fz="xs" label="Get AI to generate a new page">
              <Button
                variant="light"
                leftIcon={<IconSparkles size={ICON_SIZE} />}
                onClick={() => handlePageNamesGeneration("1")}
                loading={isLoading}
                disabled={hasPagesCreated}
              >
                Generate one page
              </Button>
            </Tooltip>
            <Tooltip fz="xs" label="Add empty page so you can freetype">
              <Button
                variant="outline"
                leftIcon={<IconPlus size={ICON_SIZE} />}
                onClick={() => addEmptyPage()}
                loading={isLoading}
                disabled={
                  pages.some((page) => page.name === "") || hasPagesCreated
                }
              >
                Add new page
              </Button>
            </Tooltip>
          </>
        )}
      </Flex>
      <Group position="apart">
        <BackButton onClick={prevStep} />

        {!hasPageNames ? (
          <Button
            variant="light"
            leftIcon={<IconSparkles size={ICON_SIZE} />}
            onClick={() => handlePageNamesGeneration("5-8")}
            loading={isLoading}
            disabled={isLoading || hasPageNames}
          >
            Generate pages
          </Button>
        ) : (
          <NextButton
            onClick={async () => {
              if (!hasPagesCreated) await createManyPages(projectId);
              nextStep();
            }}
            isLoading={isLoading}
            disabled={isLoading}
          />
        )}
      </Group>
    </Stack>
  );
}
