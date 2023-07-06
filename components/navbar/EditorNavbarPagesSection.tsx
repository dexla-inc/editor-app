import { getPageList } from "@/requests/pages/queries";
import { useEditorStore } from "@/stores/editor";
import { Center, Loader, Stack, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

export const EditorNavbarPagesSection = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const id = router.query.id as string;
  const currentPage = router.query.page as string;
  const resetTree = useEditorStore((state) => state.resetTree);
  const pages = useEditorStore((state) => state.pages);
  const setPages = useEditorStore((state) => state.setPages);

  const getPages = useCallback(async () => {
    const pageList = await getPageList(id);
    setPages(pageList.results);
  }, [id, setPages]);

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
    <Stack spacing={0}>
      {pages.map((page) => {
        return (
          <Text
            key={page.id}
            size="xs"
            component={Link}
            href={`/projects/${id}/editor/${page.id}`}
            p="xs"
            sx={{
              borderRadius: theme.radius.md,
              textDecoration: "none",
              fontWeight: currentPage === page.id ? 500 : "normal",
              color:
                currentPage === page.id ? theme.black : theme.colors.gray[7],
              backgroundColor:
                currentPage === page.id ? theme.colors.gray[0] : undefined,

              "&:hover": {
                backgroundColor: theme.colors.gray[0],
                color: theme.black,
              },
            }}
            onClick={() => {
              resetTree();
            }}
          >
            {page.title}
          </Text>
        );
      })}
    </Stack>
  );
};
