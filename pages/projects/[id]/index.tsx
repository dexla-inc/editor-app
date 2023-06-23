import { Shell } from "@/components/AppShell";
import { TypingAnimation } from "@/components/TypingAnimation";
import { PageParams, createPages } from "@/requests/projects/mutations";
import { getPageList, getPagesStream } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE } from "@/utils/config";
import TOML from "@iarna/toml";
import {
  Button,
  Container,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck, IconSparkles } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

type Props = {
  id: string;
};

export default function Project({ id }: Props) {
  const router = useRouter();
  const isLoading = useAppStore((state) => state.isLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const [stream, setStream] = useState<string>("");
  const [pages, setPages] = useState<string[]>([]);

  const getPageStream = async () => {
    startLoading({
      id: "pages-stream",
      title: "Generating the Page Names",
      message: "Wait while AI generates the names of your pages",
    });
    const data = await getPagesStream(id);

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
      setStream((state) => {
        try {
          return `${state}${chunkValue}`;
        } catch (error) {
          return state;
        }
      });
    }

    stopLoading({
      id: "pages-stream",
      title: "Names Generated",
      message: "Here's your pages names. We hope you like it",
    });
  };

  const goToEditor = async () => {
    await createPages(
      pages.map((page, index) => {
        return {
          title: page,
          slug: slugify(page),
          isHome: index === 0,
          authenticatedOnly: false,
        } as PageParams;
      }) as PageParams[],
      id
    );
    const pageList = await getPageList(id);
    const homepage = pageList.results.find((page) => page.isHome);
    router.push(`/projects/${id}/editor/${homepage?.id}`);
  };

  useEffect(() => {
    if (stream) {
      try {
        const json = TOML.parse(stream);
        setPages(Object.values(json) as string[]);
      } catch (error) {
        // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
        // console.log({ error });
      }
    }
  }, [stream]);

  const hasPageNames = pages.length > 0;

  return (
    <Shell>
      <Container size="xs" py={60}>
        <Stack spacing="xl">
          <Title order={2}>Project Pages</Title>
          {hasPageNames && (
            <List
              my={"xl"}
              spacing="xs"
              size="sm"
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
                    <TypingAnimation onlyWhileLoading={false} text={page} />
                  </List.Item>
                );
              })}
            </List>
          )}
          {!hasPageNames && (
            <Text size="sm" color="dimmed">
              Click on the button below to generate the project page names
            </Text>
          )}

          <Group>
            <Button
              leftIcon={<IconSparkles size={ICON_SIZE} />}
              onClick={getPageStream}
              loading={isLoading}
              disabled={isLoading || hasPageNames}
            >
              Generate page names
            </Button>
            <Button
              leftIcon={<IconSparkles size={ICON_SIZE} />}
              onClick={goToEditor}
              disabled={!hasPageNames}
            >
              Generate page structure
            </Button>
          </Group>
        </Stack>
      </Container>
    </Shell>
  );
}
