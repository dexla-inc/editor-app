import { Shell } from "@/components/AppShell";
import { DataSourceItem } from "@/components/datasources/DataSourceItem";
import IconTitleDescriptionButton from "@/components/projects/NewProjectButton";
import { getDataSources } from "@/requests/datasources/queries";
import { DataSourceResponse } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Container,
  Flex,
  Grid,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { IconSearch, IconSparkles } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function DataSources() {
  const [pagedDataSource, setPagedDataSource] =
    useState<PagingResponse<DataSourceResponse>>();
  const [search, setSearch] = useState<string>();
  const debouncedSearch = debounce((query) => setSearch(query), 400);
  const theme = useMantineTheme();
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const { isLoading, setIsLoading, startLoading, stopLoading } = useAppStore();
  const router = useRouter();
  const projectId = router.query.id as string;

  const fetch = useCallback(async () => {
    const result = await getDataSources(projectId, { search });
    setPagedDataSource(result);
  }, [projectId, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleDelete = (id: string) => {
    setPagedDataSource((pagedDataSource) => {
      if (!pagedDataSource) {
        return undefined;
      }

      return {
        ...pagedDataSource,
        results: pagedDataSource.results.filter((r) => r.id !== id),
      } as PagingResponse<DataSourceResponse>;
    });
  };

  return (
    <Shell navbarType="project" user={user}>
      <Container py="xl">
        <Stack spacing="xl">
          <Title>Data Source Settings</Title>

          <Flex>
            <Link
              href="/projects/[id]/settings/datasources/new"
              as={`/projects/${projectId}/settings/datasources/new`}
            >
              <IconTitleDescriptionButton
                icon={
                  <IconSparkles
                    size={LARGE_ICON_SIZE}
                    color={theme.colors.teal[5]}
                  />
                }
                title="Create new data source"
                description="Create as many data sources as you like. We only support APIs for now but GraphQL and Airtable are coming soon!"
              ></IconTitleDescriptionButton>
            </Link>
          </Flex>
          {pagedDataSource && (
            <TextInput
              placeholder="Search a data source"
              icon={<IconSearch size={ICON_SIZE} />}
              onChange={(event) => {
                debouncedSearch(event.currentTarget.value);
              }}
            />
          )}
          <Grid>
            {pagedDataSource &&
              pagedDataSource.results.map((datasource) => {
                return (
                  <DataSourceItem
                    key={datasource.id}
                    datasource={datasource}
                    theme={theme}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                  />
                );
              })}
          </Grid>
        </Stack>
      </Container>
    </Shell>
  );
}
