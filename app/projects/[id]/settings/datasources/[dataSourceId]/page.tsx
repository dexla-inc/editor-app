"use client";

import { SuccessAlert } from "@/components/Alerts";
import { DashboardShell } from "@/components/DashboardShell";
import AuthenticationBearer from "@/components/datasources/AuthenticationBearer";
import { ExampleResponseDropdown } from "@/components/datasources/AuthenticationInputs";
import {
  BasicDetailsInputs,
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { DataSourceEndpointList } from "@/components/datasources/DataSourceEndpointList";
import EndpointsButton from "@/components/datasources/EndpointsButton";
import {
  SwaggerURLInput,
  validateSwaggerUrl,
} from "@/components/datasources/SwaggerURLInput";
import { TestUserLogin } from "@/components/datasources/TestUserLogin";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { updateDataSource } from "@/requests/datasources/mutations";
import { getSwagger } from "@/requests/datasources/queries";
import { getDataSource } from "@/requests/datasources/queries";
import {
  AuthenticationSchemes,
  DataSourceParams,
  DataSourceResponse,
  Endpoint,
  RequestBody,
} from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE } from "@/utils/config";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import { usePropelAuthStore } from "@/stores/propelAuth";

export default function DataSourcePage() {
  const {
    query: { id, name, dataSourceId },
  } = useOldRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const [dataSource, setDataSource] = useState<DataSourceResponse>(
    {} as DataSourceResponse,
  );

  const [authenticationScheme, setAuthenticationScheme] =
    useState<AuthenticationSchemes | null>(null);
  const [swaggerUrl, setSwaggerUrl] = useState<string>("");
  const [swaggerRefetched, setSwaggerRefetched] = useState<boolean>(false);
  const [loginEndpointId, setLoginEndpointId] = useState<string | null>(null);
  const [refreshEndpointId, setRefreshEndpointId] = useState<string | null>(
    null,
  );
  const [userEndpointId, setUserEndpointId] = useState<string | null>(null);
  const [loginRequestBody, setLoginRequestBody] = useState<
    RequestBody[] | undefined
  >(undefined);
  const [exampleResponse, setExampleResponse] = useState<
    ExampleResponseDropdown[] | undefined
  >(undefined);
  const [loginEndpointObj, setLoginEndpointObj] = useState<
    Endpoint | undefined
  >(undefined);

  const form = useForm<DataSourceParams>({
    validate: {
      swaggerUrl: (value) => (value ? validateSwaggerUrl(value) : null),
      baseUrl: (value) => validateBaseUrl(value),
      name: (value) => validateName(value),
      apiKey: (value, values) =>
        values.authenticationScheme === "NONE"
          ? null
          : value === ""
            ? "You must provide an API key"
            : null,
    },
  });

  const onSubmit = async (values: DataSourceParams) => {
    try {
      startLoading({
        id: "updating",
        title: "Updating Data Source",
        message:
          "Wait while we generate your API endpoints from your API specification",
      });

      form.validate();

      const reFetch = swaggerUrl !== values.swaggerUrl;

      var result = await updateDataSource(id, dataSourceId, reFetch, values);

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
    } catch (error: any) {
      console.error(error);
      stopLoading({
        id: "updating",
        title: "Data Source Failed",
        message: error,
        isError: true,
      });
    }
  };

  const refetchSwagger = async () => {
    try {
      startLoading({
        id: "updating",
        title: "Updating Data Source",
        message:
          "Wait while we generate your API endpoints from your API specification",
      });
      setIsLoading(true);

      form.validate();

      const accessToken = usePropelAuthStore.getState().accessToken;

      if (dataSource.type === "SUPABASE") {
        const swaggerResponse = await fetch(
          `/api/swagger2openapi?projectId=${id}&baseUrl=${encodeURIComponent(dataSource.baseUrl)}&relativeUrl=/rest/v1/&apiKey=${encodeURIComponent(
            dataSource.apiKey as string,
          )}&accessToken=${encodeURIComponent(accessToken)}&type=${dataSource.type}`,
        );

        if (!swaggerResponse.ok) {
          const errorData = await swaggerResponse.json();
          throw new Error(
            errorData.error || "Failed to convert Swagger to OpenAPI",
          );
        }
      }

      const result = await getSwagger(id, dataSourceId);

      setDataSource(result);

      form.setValues(result);

      setSwaggerRefetched(true);

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      stopLoading({
        id: "updating",
        title: "Data Source Failed",
        message:
          error ??
          "Could not fetch swagger file. Please check the URL and try again.",
        isError: true,
      });
    }
  };

  useEffect(() => {
    (async () => {
      const result = await getDataSource(id, dataSourceId);
      form.setValues(result);
      setDataSource(result);
      setSwaggerUrl(result.swaggerUrl);
      setAuthenticationScheme(result.authenticationScheme);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceId, id]);

  return (
    <DashboardShell>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="datasources" pt="xs">
          <Container py="xl">
            <form onSubmit={form.onSubmit(onSubmit)}>
              <Stack>
                <Title>Data Source Details</Title>
                <Title order={3}>API Information</Title>

                {swaggerUrl && (
                  <Group position="apart">
                    <Button
                      onClick={refetchSwagger}
                      variant="light"
                      leftIcon={<IconRefresh size={ICON_SIZE} />}
                    >
                      Refetch Swagger
                    </Button>
                    <EndpointsButton
                      projectId={id}
                      startLoading={startLoading}
                      stopLoading={stopLoading}
                      isLoading={isLoading}
                    ></EndpointsButton>
                  </Group>
                )}
                {swaggerRefetched && (
                  <>
                    <SuccessAlert
                      title="Successfully Updated"
                      text="Your API has been successfully. The editor will now show your updated API and API endpoints."
                    ></SuccessAlert>
                  </>
                )}
                {dataSource.type === "SWAGGER" && (
                  <SwaggerURLInput
                    isLoading={isLoading}
                    swaggerUrl={swaggerUrl}
                    setSwaggerUrl={setSwaggerUrl}
                  />
                )}
                <BasicDetailsInputs
                  form={form}
                  setAuthenticationScheme={setAuthenticationScheme}
                />
                {authenticationScheme === "API_KEY" && (
                  <TextInput
                    label="API Key"
                    description="The key used to authenticate to the API"
                    placeholder="aa982f3c39b17...."
                    {...form.getInputProps("apiKey")}
                    onChange={(e) => {
                      form.setFieldValue("apiKey", e.target.value);
                    }}
                  />
                )}
                <Flex>
                  <Button type="submit">Save</Button>
                </Flex>
              </Stack>
            </form>
            <Box mt="lg">
              {authenticationScheme === "BEARER" && (
                <Stack>
                  <Divider></Divider>
                  <Title order={3}>Bearer Token Configuration</Title>
                  <AuthenticationBearer
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                    dataSource={dataSource}
                    loginEndpointId={loginEndpointId}
                    setLoginEndpointId={setLoginEndpointId}
                    refreshEndpointId={refreshEndpointId}
                    setRefreshEndpointId={setRefreshEndpointId}
                    userEndpointId={userEndpointId}
                    setUserEndpointId={setUserEndpointId}
                    setExampleResponse={setExampleResponse}
                    exampleResponse={exampleResponse}
                    setLoginRequestBody={setLoginRequestBody}
                    fromPage={true}
                  />
                </Stack>
              )}
            </Box>
            <Stack>
              <Divider></Divider>
              {loginRequestBody && loginRequestBody.length > 0 && (
                <TestUserLogin
                  projectId={id}
                  requestBody={loginRequestBody}
                  url={
                    dataSource?.baseUrl + "/" + loginEndpointObj?.relativeUrl
                  }
                  dataSourceId={dataSource.id}
                ></TestUserLogin>
              )}

              <DataSourceEndpointList
                baseUrl={dataSource?.baseUrl}
                projectId={id}
                dataSourceId={dataSourceId}
              />
              <Stack>
                {dataSource?.changedEndpoints && (
                  <Title order={6}>Changed Endpoints</Title>
                )}
                {dataSource?.changedEndpoints?.map((endpoint) => {
                  return (
                    <DataSourceEndpoint
                      baseUrl={dataSource.baseUrl}
                      key={endpoint.id}
                      projectId={id}
                      endpoint={endpoint}
                      location="datasource"
                    ></DataSourceEndpoint>
                  );
                })}

                {dataSource?.deletedEndpoints && (
                  <Title order={6}>Deleted Endpoints</Title>
                )}
                {dataSource?.deletedEndpoints?.map((endpoint) => {
                  return (
                    <DataSourceEndpoint
                      baseUrl={dataSource.baseUrl}
                      key={endpoint.id}
                      projectId={id}
                      endpoint={endpoint}
                      location="datasource"
                    ></DataSourceEndpoint>
                  );
                })}
              </Stack>
            </Stack>
          </Container>
        </Tabs.Panel>
      </Tabs>
    </DashboardShell>
  );
}
