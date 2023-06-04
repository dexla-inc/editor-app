import { PageResponse, getPageList } from "@/requests/projects/queries";
import { Center, Loader, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const EditorNavbarPagesSection = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [pages, setPages] = useState<PageResponse[]>([]);

  const getPages = useCallback(async () => {
    const pageList = await getPageList(id);
    setPages(pageList.results);
  }, [id]);

  useEffect(() => {
    getPages();
  }, [id, getPages]);

  if (pages.length === 0) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Stack>
      {pages.map((page) => {
        return (
          <Text key={page.id} size="xs">
            {page.title}
          </Text>
        );
      })}
    </Stack>
  );
};
