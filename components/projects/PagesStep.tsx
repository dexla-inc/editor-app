import { InformationAlert } from "@/components/Alerts";
import BackButton from "@/components/projects/BackButton";
import NextButton from "@/components/projects/NextButton";
import { PageParams, createPages } from "@/requests/projects/mutations";
import { getPagesStream } from "@/requests/projects/queries";
import { ICON_SIZE } from "@/utils/config";
import { LoadingStore } from "@/utils/projectTypes";
import TOML from "@iarna/toml";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  List,
  Stack,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconPlus,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
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

export default function PagesStep({
  prevStep,
  nextStep,
  isLoading,
  startLoading,
  stopLoading,
  projectId,
}: LoadingStore & { prevStep: () => void } & { nextStep: () => void } & {
  projectId: string;
}) {
  const [pages, setPages] = useState<string[]>([]);
  const router = useRouter();

  const getPages = async (count: number) => {
    const plural = count === 1 ? "" : "s";
    startLoading({
      id: "pages-stream",
      title: `Generating Page Name${plural}`,
      message: `Wait while AI generates the name${plural} of your page${plural}`,
    });

    const data = await getPagesStream(projectId, count, pages.join());

    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      try {
        const json = TOML.parse(chunkValue);
        const newPages = Object.values(json) as string[];
        setPages((oldPages) => [...oldPages, ...newPages]);
      } catch (error) {
        // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
        console.error(error);
      }
    }

    stopLoading({
      id: "pages-stream",
      title: "Names Generated",
      message: "Here's your pages names. We hope you like it",
    });
  };

  const goToEditor = async (projectId: string) => {
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
        } as PageParams;
      }) as PageParams[],
      projectId
    );

    stopLoading({
      id: "creating-pages",
      title: "Pages Created",
      message: "Your pages were added to your project successfully",
    });

    console.log(createdPages.homePageId);

    router.push(`/projects/${projectId}/editor/${createdPages.homePageId}`);
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
                <List.Item key={page}>
                  <Flex align="center" gap="md">
                    <TextInput defaultValue={page} sx={{ width: "400px" }} />
                    <ActionIcon
                      onClick={() => deletePage(page)}
                      variant="filled"
                      color="red"
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
            onClick={() => getPages(5)}
            loading={isLoading}
            disabled={isLoading || hasPageNames}
          >
            Generate page names
          </Button>
        ) : (
          <Button
            variant="light"
            leftIcon={<IconPlus size={ICON_SIZE} />}
            onClick={() => getPages(1)}
            loading={isLoading}
          >
            Generate new page
          </Button>
        )}
      </Flex>
      <Group position="apart">
        <BackButton onClick={prevStep as () => void}></BackButton>

        <NextButton
          onClick={() => goToEditor(projectId)}
          isLoading={isLoading}
          disabled={!hasPageNames}
        ></NextButton>
      </Group>
    </Stack>
  );
}
