import { DataSourceItem } from "@/components/datasources/DataSourceItem";
import IconTitleDescriptionButton from "@/components/projects/NewProjectButton";
import { getDataSources } from "@/requests/datasources/queries-noauth";
import { DataSourceResponse } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { ICON_SIZE } from "@/utils/config";
import {
  Container,
  Flex,
  Grid,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Props = {
  projectId: string;
};

export default function DataSourceSettings({ projectId }: Props) {
  const [pagedDataSource, setPagedDataSource] =
    useState<PagingResponse<DataSourceResponse>>();
  const [search, setSearch] = useState<string>();
  const debouncedSearch = debounce((query) => setSearch(query), 400);
  const theme = useMantineTheme();

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
    <Container py="xl">
      <Stack spacing="xl">
        <Title order={2}>Data Source Settings</Title>
        <Flex>
          <Link href={`/projects/${projectId}/settings/datasources/new`}>
            <IconTitleDescriptionButton
              icon="IconSparkles"
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
                  onDelete={handleDelete}
                />
              );
            })}
        </Grid>
      </Stack>
    </Container>
  );
}
