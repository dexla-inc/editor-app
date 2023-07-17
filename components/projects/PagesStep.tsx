import { InformationAlert } from "@/components/Alerts";
import BackButton from "@/components/BackButton";
import NextButton from "@/components/NextButton";
import { getPagesEventSource } from "@/requests/ai/queries";
import { createPages } from "@/requests/pages/mutations";
import { PageBody } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  LoadingStore,
  PreviousStepperClickEvent,
} from "@/utils/dashboardTypes";
import TOML from "@iarna/toml";
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
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import {
  IconCircleCheck,
  IconPlus,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { SetStateAction, useState } from "react";
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

export interface PagesStepProps
  extends LoadingStore,
    PreviousStepperClickEvent {
  projectId: string;
  pages: string[];
  setPages: (value: SetStateAction<string[]>) => void;
}

export default function PagesStep({
  prevStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  projectId,
  pages,
  setPages,
}: PagesStepProps) {
  const router = useRouter();
  const [formComplete, setFormComplete] = useState(false);
  const resetTree = useEditorStore((state) => state.resetTree);

  const updatePage = (index: number, value: string) => {
    const updatedPages = [...pages];
    updatedPages[index] = value;
    setPages(updatedPages);
  };

  const addEmptyPage = () => {
    setPages((oldPages) => [...oldPages, ""]);
  };

  const stream = async (count: number) => {
    const plural = count === 1 ? "" : "s";
    setIsLoading && setIsLoading(true);
    startLoading({
      id: "pages-stream",
      title: `Generating Page Name${plural}`,
      message: `Wait while AI generates the name${plural} of your page${plural}`,
    });

    const onMessage = (event: EventSourceMessage) => {
      try {
        const json = TOML.parse(event.data);
        const newPages = Object.values(json) as string[];
        setPages((oldPages) => [...oldPages, ...newPages]);
        stopLoading({
          id: "pages-stream",
          title: "Names Generated",
          message: "Here's your pages names. We hope you like it",
        });
        setIsLoading && setIsLoading(false);
      } catch (error) {
        // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
        console.error(error);
      }
    };

    const onError = (err: any) => {
      stopLoading({
        id: "pages-stream",
        title: "There was a problem",
        message: err,
        isError: true,
      });
      setIsLoading && setIsLoading(false);
    };

    const onOpen = async (response: Response) => {
      // handle open
    };

    getPagesEventSource(
      projectId,
      count,
      pages.join(),
      onMessage,
      onError,
      onOpen
    );
  };

  const goToEditor = async (projectId: string) => {
    resetTree();
    setIsLoading && setIsLoading(true);
    startLoading({
      id: "creating-pages",
      title: "Creating Pages",
      message: "Wait while your pages are being created",
    });

    const createdPages = await createPages(
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

    router.push(`/projects/${projectId}/editor/${createdPages.homePageId}`);

    setFormComplete(true);
  };

  const deletePage = (pageToRemove: string) => {
    setPages((pages) => pages.filter((page) => page !== pageToRemove));
  };

  const hasPageNames = pages.length > 0;

  return (
    <Stack spacing="xl">
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
                      <IconTrash size={ICON_SIZE} />
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
            onClick={() => stream(5)}
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
              onClick={() => stream(1)}
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

        <NextButton
          onClick={() => goToEditor(projectId)}
          isLoading={isLoading}
          disabled={!hasPageNames}
        ></NextButton>
      </Group>
    </Stack>
  );
}
