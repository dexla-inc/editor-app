import { InformationAlert } from "@/components/Alerts";
import BackButton from "@/components/BackButton";
import { Icon } from "@/components/Icon";
import { createPageList, createPages } from "@/requests/pages/mutations";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import {
  NextStepperClickEvent,
  PreviousStepperClickEvent,
} from "@/utils/dashboardTypes";
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  List,
  Stack,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { IconCircleCheck, IconPlus, IconSparkles } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import { SetStateAction, useEffect, useRef } from "react";
import NextButton from "../NextButton";
import slugify from "slugify";
import { PageBody } from "@/requests/pages/types";
import {
  createDataSource,
  createDataSourceEndpoint,
} from "@/requests/datasources/mutations";
import { createVariable } from "@/requests/variables/mutations";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  return {
    props: {
      id: query.id,
    },
  };
};

export interface PagesStepProps
  extends PreviousStepperClickEvent,
    NextStepperClickEvent {
  projectId: string;
  pages: { name: string; description: string }[];
  setPages: (
    value: SetStateAction<{ name: string; description: string }[]>,
  ) => void;
  initialPageFetchDone: boolean;
  setInitialPageFetchDone: (value: SetStateAction<boolean>) => void;
  hasPagesCreated: boolean;
  setHasPagesCreated: (value: boolean) => void;
  setHomePageId: (value: string) => void;
}

export default function PagesStep({
  prevStep,
  nextStep,
  projectId,
  pages,
  setPages,
  initialPageFetchDone,
  setInitialPageFetchDone,
  hasPagesCreated,
  setHasPagesCreated,
  setHomePageId,
}: PagesStepProps) {
  const resetTree = useEditorStore((state) => state.resetTree);
  const initiallPageGeneration = useRef(false);
  const updatePage = (index: number, value: string) => {
    const updatedPages = [...pages];
    updatedPages[index] = { name: value, description: "A simple page" };
    setPages(updatedPages);
  };

  const addEmptyPage = () => {
    setPages((oldPages) => [...oldPages, { name: "", description: "" }]);
  };

  //const type = "PAGE" as const;
  //const [stream, setStream] = useState<string>("");
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const startLoading = useAppStore((state) => state.startLoading);

  /* const { onMessage, onError, onOpen, onClose } = createHandlers({
    setStream,
    stopLoading,
    setIsLoading,
  });

  const onCloseOverride = async () => {
    await onClose();
    setInitialPageFetchDone(true);
  }; */

  /* const fetchPageData = async (pageCount: number) => {
    setIsLoading(true);

    return await handleRequestGetStream(
      projectId,
      pageCount,
      type,
      startLoading,
      onMessage,
      onError,
      onOpen,
      onCloseOverride,
      pages.join(),
    );
  }; */

  /* const handlePageNamesGeneration = () => {
    return function (json: any) {
      const newPages = Object.values(json) as string[];
      if (!initialPageFetchDone) setPages(newPages);
      else setPages((oldPages) => [...oldPages, ...newPages]);
    };
  }; */
  // if first time and pages.length is less than 5 then set pages

  /* useEffect(() => {
    processTOMLStream({
      stream,
      handler: handlePageNamesGeneration(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, type]);

  // Ensure stream pages only happens once
  useEffect(() => {
    if (!initialPageFetchDone) {
      fetchPageData(5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); */
  useEffect(() => {
    const handlePageNamesGeneration = async () => {
      startLoading({
        id: "creating-pages",
        title: "Creating Pages",
        message: "Wait while your pages are being created",
      });
      const pages = await createPageList(projectId);
      console.log({ pages });
      setPages(pages);
      stopLoading({
        id: "creating-pages",
        title: "Pages Created",
        message: "Your pages have been created",
      });
    };

    if (!initiallPageGeneration.current) {
      handlePageNamesGeneration();
      initiallPageGeneration.current = true;
    }
  }, [projectId, setPages, startLoading, stopLoading]);

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
            description: page.description,
            isHome: index === 0,
            authenticatedOnly: false,
          } as PageBody;
        }) as PageBody[],
        projectId,
      );

      const baseUrl = "https://visnduvexezenksqpvmo.supabase.co/rest/v1/";

      const dataSource = await createDataSource(projectId, "API", {
        name: "Example API",
        baseUrl,
        environment: "staging",
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
          },
          {
            name: "select",
            type: "string",
            required: true,
            description: "",
            value: "data",
            location: "Query",
          },
        ],
        requestBody: [],
        mediaType: "application/json",
        withCredentials: null,
        authenticationScheme: "NONE",
        exampleResponse,
        errorExampleResponse: "",
        isServerRequest: false,
        baseUrl,
      });

      await createVariable(projectId, {
        name: "GET Project Data",
        type: "OBJECT",
        value: JSON.stringify(exampleResponse),
        defaultValue: JSON.stringify(exampleResponse),
        isGlobal: true,
        pageId: createdPages.homePageId,
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
      console.log({ error });
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
    <Stack spacing="xl" mb="xl">
      {hasPageNames && (
        <>
          <InformationAlert
            title="Generated Page Names"
            text="Feel free to change the page names if they aren't quite right or app some new ones before generating your app."
          />
          <List
            spacing="xs"
            size="xl"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck size={ICON_SIZE} />
              </ThemeIcon>
            }
          >
            {pages.map(({ name: page }, index) => {
              return (
                <List.Item key={index}>
                  <Flex align="center" gap="md">
                    <TextInput
                      value={page}
                      sx={{ width: "400px" }}
                      onChange={(event) =>
                        updatePage(index, event.currentTarget.value)
                      }
                    />
                    <ActionIcon
                      onClick={() => deletePage(page)}
                      variant="filled"
                      color="red"
                      tabIndex={-1}
                    >
                      <Icon name={ICON_DELETE} />
                    </ActionIcon>
                  </Flex>
                </List.Item>
              );
            })}
          </List>
        </>
      )}
      {!hasPageNames && (
        <InformationAlert
          title="Generate Your Page Names"
          text="Click on the button below to generate page names for your project"
        />
      )}
      <Flex gap="lg">
        {!hasPageNames ? (
          <Button
            variant="light"
            leftIcon={<IconSparkles size={ICON_SIZE} />}
            //onClick={() => stream(5)}
            loading={isLoading}
            disabled={isLoading || hasPageNames}
          >
            Generate page names
          </Button>
        ) : (
          <>
            <Button
              variant="light"
              leftIcon={<IconPlus size={ICON_SIZE} />}
              onClick={() => {
                // fetchPageData(1);
              }}
              loading={isLoading}
              disabled={hasPagesCreated}
            >
              Generate new page
            </Button>
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
          </>
        )}
      </Flex>
      <Divider />
      <Group position="apart">
        <BackButton onClick={prevStep} />

        <NextButton
          onClick={async () => {
            if (!hasPagesCreated) await createManyPages(projectId);
            nextStep();
          }}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </Group>
    </Stack>
  );
}
