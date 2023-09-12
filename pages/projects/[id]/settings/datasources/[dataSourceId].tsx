import { SuccessAlert } from "@/components/Alerts";
import { DashboardShell } from "@/components/DashboardShell";
import AuthenticationBearer from "@/components/datasources/AuthenticationBearer";
import {
  ExampleResponseDropdown,
  filterAndMapEndpoints,
} from "@/components/datasources/AuthenticationInputs";
import {
  BasicDetailsInputs,
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import EndpointsButton from "@/components/datasources/EndpointsButton";
import {
  SwaggerURLInput,
  validateSwaggerUrl,
} from "@/components/datasources/SwaggerURLInput";
import { TestUserLogin } from "@/components/datasources/TestUserLogin";
import { SettingsTabHeader } from "@/components/settings/SettingsTabHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { updateDataSource } from "@/requests/datasources/mutations";
import {
  getDataSource,
  getDataSourceEndpoints,
  getSwagger,
} from "@/requests/datasources/queries";
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
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuthInfo } from "@propelauth/react";
import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const { id, name, dataSourceId } = router.query as {
    id: string;
    name: string;
    dataSourceId: string;
  };

  const [dataSource, setDataSource] = useState<DataSourceResponse>(
    {} as DataSourceResponse
  );

  const [endpoints, setEndpoints] = useState<Array<Endpoint> | undefined>(
    undefined
  );

  const [authenticationScheme, setAuthenticationScheme] =
    useState<AuthenticationSchemes | null>(null);
  const [swaggerUrl, setSwaggerUrl] = useState<string>("");
  const [swaggerRefetched, setSwaggerRefetched] = useState<boolean>(false);
  const [loginEndpointId, setLoginEndpointId] = useState<string | null>(null);
  const [refreshEndpointId, setRefreshEndpointId] = useState<string | null>(
    null
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
  const postEndpoints = filterAndMapEndpoints(endpoints, "POST");
  const getEndpoints = filterAndMapEndpoints(endpoints, "GET");

  const apiForm = useForm<DataSourceParams>({
    validate: {
      swaggerUrl: (value) => validateSwaggerUrl(value),
      baseUrl: (value) => validateBaseUrl(value),
      name: (value) => validateName(value),
    },
  });

  const onApiSubmit = async (values: DataSourceParams) => {
    try {
      startLoading({
        id: "updating",
        title: "Updating Data Source",
        message:
          "Wait while we generate your API endpoints from your API specification",
      });

      apiForm.validate();

      const reFetch = swaggerUrl !== values.swaggerUrl;

      await updateDataSource(id, dataSourceId, reFetch, values);

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
    } catch (error: any) {
      console.log(error);
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

      apiForm.validate();

      const result = await getSwagger(id, dataSourceId, swaggerUrl);

      setDataSource(result);

      apiForm.setValues(result);

      setSwaggerRefetched(true);

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await getDataSource(id, dataSourceId);
      apiForm.setValues(result);
      setDataSource(result);
      setSwaggerUrl(result.swaggerUrl);
      setAuthenticationScheme(result.authenticationScheme);

      const endpointsResult = await getDataSourceEndpoints(id, dataSourceId);
      setEndpoints(endpointsResult.results);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceId, id]);

  return (
    <DashboardShell user={user}>
      <SettingsTabHeader name={name} />
      <Tabs defaultValue="datasources" py="xs">
        <SettingsTabs />

        <Tabs.Panel value="datasources" pt="xs">
          <Container py="xl">
            <form onSubmit={apiForm.onSubmit(onApiSubmit)}>
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
                      text="Go To Editor"
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
                <SwaggerURLInput
                  isLoading={isLoading}
                  swaggerUrl={swaggerUrl}
                  setSwaggerUrl={setSwaggerUrl}
                />
                <BasicDetailsInputs
                  form={apiForm}
                  authenticationScheme={authenticationScheme}
                  setAuthenticationScheme={setAuthenticationScheme}
                />
                <Flex>
                  <Button type="submit">Save</Button>
                </Flex>
                <Divider></Divider>
              </Stack>
            </form>
            {authenticationScheme === "BEARER" && (
              <Box mt="lg">
                <Title order={3}>Bearer Token Configuration</Title>
                <AuthenticationBearer
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  startLoading={startLoading}
                  stopLoading={stopLoading}
                  dataSource={dataSource}
                  endpoints={endpoints}
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
              </Box>
            )}
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
              <Stack>
                {dataSource?.changedEndpoints && (
                  <Title order={6}>Changed Endpoints</Title>
                )}
                {dataSource?.changedEndpoints?.map((endpoint) => {
                  return (
                    <DataSourceEndpoint
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
