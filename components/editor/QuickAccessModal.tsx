import { Stack, Tabs, Tooltip, useMantineTheme } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { QuickAccessActionButton } from "./QuickAccessActionButton";
import DataSourceAddSwagger from "../datasources/DataSourceAddSwagger";
import { InformationAlert } from "../Alerts";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  return {
    props: {
      id: query.id,
      page: query.page,
    },
  };
};

export default function QuickAccessModal({ context, id }: ContextModalProps) {
  const theme = useMantineTheme();

  const [filter, setFilter] = useState<"quick-access" | "swagger">(
    "quick-access",
  );

  const startSwaggerFlow = () => {
    setFilter("swagger");
  };

  return (
    <Stack>
      {filter === "quick-access" ? (
        <>
          <InformationAlert text="Welcome! Let's start by adding a datasource, or you can come back later and do it." />
          <Tabs value="datasource">
            <Tabs.List>
              <Tabs.Tab value="datasource">Datasource</Tabs.Tab>
              <Tooltip label="Coming soon">
                <Tabs.Tab value="ai" disabled>
                  Generate with AI
                </Tabs.Tab>
              </Tooltip>
            </Tabs.List>
            <Tabs.Panel value="datasource">
              <Stack p="sm">
                <QuickAccessActionButton
                  imageSrc={`/swagger_logo${
                    theme.colorScheme === "dark" ? "_white" : ""
                  }.svg`}
                  imageAlt="Swagger Logo"
                  subtitle="Open API / Swagger"
                  caption="Connect your backend with your API Spec"
                  onClick={startSwaggerFlow}
                />
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </>
      ) : (
        filter === "swagger" && (
          <DataSourceAddSwagger closeModal={() => context.closeModal(id)} />
        )
      )}
    </Stack>
  );
}
