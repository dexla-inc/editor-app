import { InformationAlert } from "@/components/Alerts";
import BackButton from "@/components/BackButton";
import { Icon } from "@/components/Icon";
import { createPages } from "@/requests/pages/mutations";
import { PageBody } from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { PreviousStepperClickEvent } from "@/utils/dashboardTypes";
import {
  createHandlers,
  handleRequestGetStream,
  processTOMLStream,
} from "@/utils/streamingAI";
import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  List,
  Stack,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconDatabase,
  IconPlus,
  IconSparkles,
} from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import slugify from "slugify";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  return {
    props: {
      id: query.id,
    },
  };
};

export interface PagesStepProps extends PreviousStepperClickEvent {
  projectId: string;
  pages: string[];
  setPages: (value: SetStateAction<string[]>) => void;
  initialPageFetchDone: boolean;
  setInitialPageFetchDone: (value: SetStateAction<boolean>) => void;
}

export default function PagesStep({
  prevStep,
  projectId,
  pages,
  setPages,
  initialPageFetchDone,
  setInitialPageFetchDone,
}: PagesStepProps) {
  const router = useRouter();
  const resetTree = useEditorStore((state) => state.resetTree);
  const [count, setCount] = useState(5);
  const updatePage = (index: number, value: string) => {
    const updatedPages = [...pages];
    updatedPages[index] = value;
    setPages(updatedPages);
  };

  const addEmptyPage = () => {
    setPages((oldPages) => [...oldPages, ""]);
  };

  const type = "PAGE" as const;
  const [stream, setStream] = useState<string>("");
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const startLoading = useAppStore((state) => state.startLoading);

  const { onMessage, onError, onOpen, onClose } = createHandlers({
    setStream,
    type,
    stopLoading,
    setIsLoading,
  });

  const onCloseOverride = async () => {
    console.log("Closing stream");
    await onClose();
    setInitialPageFetchDone(true);
  };

  const fetchPageData = async (pageCount: number) => {
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
      pages.join()
    );
  };

  const handlePageNamesGeneration = () => {
    return function (json: any) {
      const newPages = Object.values(json) as string[];
      if (!initialPageFetchDone) setPages(newPages);
      else setPages((oldPages) => [...oldPages, ...newPages]);
    };
  };
  // if first time and pages.length is less than 5 then set pages

  useEffect(() => {
    processTOMLStream({
      stream,
      handler: handlePageNamesGeneration(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, type]);

  // Ensure stream pages only happens once
  useEffect(() => {
    if (!initialPageFetchDone) {
      fetchPageData(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createManyPages = async (projectId: string) => {
    resetTree();
    setIsLoading(true);
    startLoading({
      id: "creating-pages",
      title: "Creating Pages",
      message: "Wait while your pages are being created",
    });

    return createPages(
      pages.map((page, index) => {
        return {
          title: page,
          slug: slugify(page),
          isHome: index === 0,
          authenticatedOnly: false,
        } as PageBody;
      }) as PageBody[],
      projectId
    );
  };

  const createPagesThenGoToEditor = async (projectId: string) => {
    const manyPages = await createManyPages(projectId);
    router.push(`/projects/${projectId}/editor/${manyPages.homePageId}`);
  };

  const createPagesThenGoToDataSource = async (projectId: string) => {
    await createManyPages(projectId);
    router.push(`/projects/${projectId}/settings/datasources/new`);
  };

  const deletePage = (pageToRemove: string) => {
    setPages((pages) => pages.filter((page) => page !== pageToRemove));
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
            {pages.map((page, index) => {
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
                fetchPageData(1);
              }}
              loading={isLoading}
            >
              Generate new page
            </Button>
            <Button
              variant="outline"
              leftIcon={<IconPlus size={ICON_SIZE} />}
              onClick={() => addEmptyPage()}
              loading={isLoading}
              disabled={pages.some((page) => page === "")}
            >
              Add new page
            </Button>
          </>
        )}
      </Flex>
      <Divider></Divider>
      <Group position="apart">
        <BackButton onClick={prevStep}></BackButton>
        <Flex gap="lg" align="end">
          {isLoading !== true && (
            <Anchor onClick={() => createPagesThenGoToEditor(projectId)}>
              Set up datasource later
            </Anchor>
          )}
          <Button
            onClick={() => createPagesThenGoToDataSource(projectId)}
            loading={isLoading}
            disabled={!hasPageNames}
            leftIcon={<IconDatabase size={ICON_SIZE} />}
          >
            Set up a datasource
          </Button>
        </Flex>
      </Group>
    </Stack>
  );
}
