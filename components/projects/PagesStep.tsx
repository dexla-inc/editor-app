import { InformationAlert } from "@/components/Alerts";
import BackButton from "@/components/projects/BackButton";
import NextButton from "@/components/projects/NextButton";
import { PageParams, createPages } from "@/requests/projects/mutations";
import { getPagesStream } from "@/requests/projects/queries";
import { ICON_SIZE } from "@/utils/config";
import { LoadingStore, StepperClickEvents } from "@/utils/projectTypes";
import TOML from "@iarna/toml";
import {
  Button,
  Flex,
  Group,
  List,
  Stack,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { IconCircleCheck, IconPlus, IconSparkles } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
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
}: StepperClickEvents & LoadingStore & { projectId: string }) {
  const [pages, setPages] = useState<string[]>([]);

  const getPages = async (count: number) => {
    startLoading({
      id: "pages-stream",
      title: "Generating the Page Names",
      message: "Wait while AI generates the names of your pages",
    });

    const data = await getPagesStream(projectId, count);

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

  const postPages = async (projectId: string) => {
    await createPages(
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
    nextStep();
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
            {pages.map((page) => {
              return (
                <List.Item key={page}>
                  <TextInput value={page} sx={{ width: "400px" }} />
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
          >
            Generate new page
          </Button>
        )}
      </Flex>
      <Group position="apart">
        <BackButton onClick={prevStep as () => void}></BackButton>

        <NextButton
          onClick={() => postPages(projectId)}
          isLoading={isLoading}
          disabled={!hasPageNames}
        ></NextButton>
      </Group>
    </Stack>
  );
}
