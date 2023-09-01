import { DashboardShell } from "@/components/DashboardShell";
import DataSourceSettings from "@/components/settings/DataSourceSettings";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Tabs } from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";

export default function DataSources() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();
  const { id, name } = router.query as { id: string; name: string };

  return (
    <DashboardShell user={user}>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="datasources" pt="xs">
          <DataSourceSettings projectId={id} />
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>

    // <DashboardShell user={user}>
    //   <Container py="xl">
    //     <Stack spacing="xl">
    //       <Title>Data Source Settings</Title>

    //       <Flex>
    //         <Link
    //           href="/projects/[id]/settings/datasources/new"
    //           as={`/projects/${projectId}/settings/datasources/new`}
    //         >
    //           <IconTitleDescriptionButton
    //             icon={
    //               <IconSparkles
    //                 size={LARGE_ICON_SIZE}
    //                 color={theme.colors.teal[5]}
    //               />
    //             }
    //             title="Create new data source"
    //             description="Create as many data sources as you like. We only support APIs for now but GraphQL and Airtable are coming soon!"
    //           ></IconTitleDescriptionButton>
    //         </Link>
    //       </Flex>
    //       {pagedDataSource && (
    //         <TextInput
    //           placeholder="Search a data source"
    //           icon={<IconSearch size={ICON_SIZE} />}
    //           onChange={(event) => {
    //             debouncedSearch(event.currentTarget.value);
    //           }}
    //         />
    //       )}
    //       <Grid>
    //         {pagedDataSource &&
    //           pagedDataSource.results.map((datasource) => {
    //             return (
    //               <DataSourceItem
    //                 key={datasource.id}
    //                 datasource={datasource}
    //                 theme={theme}
    //                 onDelete={handleDelete}
    //               />
    //             );
    //           })}
    //       </Grid>
    //     </Stack>
    //   </Container>
    // </DashboardShell>
  );
}
