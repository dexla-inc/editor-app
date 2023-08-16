import { SuccessAlert } from "@/components/Alerts";
import { Shell } from "@/components/AppShell";
import {
  AuthenticationStepParams,
  ExampleResponseDropdown,
  filterAndMapEndpoints,
  getAuthEndpoint,
  patchDataSourceWithParams,
  setExampleResponseObject,
  setRequestBodyObject,
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
import TextInputComponent from "@/components/datasources/TextInputComponent";
import { updateDataSource } from "@/requests/datasources/mutations";
import {
  getDataSource,
  getDataSourceEndpoints,
  getSwagger,
} from "@/requests/datasources/queries";
import {
  DataSourceParams,
  DataSourceResponse,
  Endpoint,
  RequestBody,
} from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE } from "@/utils/config";
import {
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Select,
  Stack,
  TextInput,
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
  const projectId = router.query.id as string;
  const dataSourceId = router.query.dataSourceId as string;
  const [dataSource, setDataSource] = useState<DataSourceResponse>(
    {} as DataSourceResponse
  );

  const [endpoints, setEndpoints] = useState<Array<Endpoint> | undefined>(
    undefined
  );

  const [authenticationScheme, setAuthenticationScheme] = useState<string>("");
  const [swaggerUrl, setSwaggerUrl] = useState<string>("");
  const [swaggerRefetched, setSwaggerRefetched] = useState<boolean>(false);
  const [loginEndpointId, setLoginEndpointId] = useState<string | undefined>(
    undefined
  );
  const [refreshEndpointId, setRefreshEndpointId] = useState<
    string | undefined
  >(undefined);
  const [userEndpointId, setUserEndpointId] = useState<string | undefined>(
    undefined
  );
  const [loginParameters, setLoginParameters] = useState<
    RequestBody[] | undefined
  >(undefined);
  const [exampleResponse, setExampleResponse] = useState<
    ExampleResponseDropdown[] | undefined
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

      await updateDataSource(projectId, dataSourceId, reFetch, values);

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const apiAuthForm = useForm<AuthenticationStepParams>({
    validateInputOnBlur: true,
    initialValues: {
      loginEndpointId: undefined,
      refreshEndpointId: undefined,
      userEndpointId: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      expiryProperty: undefined,
    },
  });

  const onApiAuthSubmit = async (values: AuthenticationStepParams) => {
    try {
      apiAuthForm.validate();

      if (Object.keys(apiAuthForm.errors).length > 0) {
        console.log("Errors: " + apiAuthForm.errors);
        return;
      }

      if (!dataSource?.id) {
        throw new Error("Can't find data source");
      }

      startLoading({
        id: "updating",
        title: "Updating Data Source",
        message: "Wait while your data source is being saved",
      });

      const {
        loginEndpointId,
        refreshEndpointId,
        userEndpointId,
        accessToken,
        refreshToken,
        expiryProperty,
      } = values;

      await patchDataSourceWithParams(
        projectId,
        dataSource.id,
        loginEndpointId as string,
        "ACCESS",
        accessToken as string,
        expiryProperty
      );

      await patchDataSourceWithParams(
        projectId,
        dataSource.id,
        refreshEndpointId as string,
        "REFRESH",
        refreshToken as string
      );

      if (userEndpointId) {
        await patchDataSourceWithParams(
          projectId,
          dataSource.id,
          userEndpointId,
          "USER"
        );
      }

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
      setIsLoading && setIsLoading(false);
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

      const result = await getSwagger(projectId, dataSourceId, swaggerUrl);

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

  const setLoginEndpoint = (value: string | undefined) => {
    setLoginEndpointId(value);
    apiAuthForm.setFieldValue("loginEndpointId", value);
    setExampleResponseObject(postEndpoints, setExampleResponse, value);
  };

  const setRefreshEndpoint = (value: string | undefined) => {
    setRefreshEndpointId(value);
    apiAuthForm.setFieldValue("refreshEndpointId", value);
    setExampleResponseObject(postEndpoints, setExampleResponse, value);
  };

  const setUserEndpoint = (value: string | undefined) => {
    setUserEndpointId(value);
    apiAuthForm.setFieldValue("userEndpointId", value);
    setExampleResponseObject(postEndpoints, setExampleResponse, value);
  };

  useEffect(() => {
    (async () => {
      const result = await getDataSource(projectId, dataSourceId);
      apiForm.setValues(result);
      setDataSource(result);
      setSwaggerUrl(result.swaggerUrl);
      setAuthenticationScheme(result.authenticationScheme);

      const endpointsResult = await getDataSourceEndpoints(
        projectId,
        dataSourceId
      );
      setEndpoints(endpointsResult.results);
    })();
  }, [dataSourceId, projectId]);

  useEffect(() => {
    if (endpoints) {
      const loginEndpoint = getAuthEndpoint("ACCESS", endpoints);
      const refreshEndpoint = getAuthEndpoint("REFRESH", endpoints);
      const userEndpoint = getAuthEndpoint("USER", endpoints);

      setLoginEndpoint(loginEndpoint?.id);
      setRefreshEndpoint(refreshEndpoint?.id);
      setUserEndpoint(userEndpoint?.id);

      apiAuthForm.setFieldValue(
        "accessToken",
        loginEndpoint?.authentication.tokenKey
      );
      apiAuthForm.setFieldValue(
        "expiryProperty",
        loginEndpoint?.authentication.tokenSecondaryKey
      );

      apiAuthForm.setFieldValue(
        "refreshToken",
        refreshEndpoint?.authentication.tokenKey
      );
    }
  }, [endpoints]);

  return (
    <Shell navbarType="project" user={user}>
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
                  projectId={projectId}
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
          <form onSubmit={apiAuthForm.onSubmit(onApiAuthSubmit)}>
            <Stack py="xl">
              <Title order={3}>Bearer Token Configuration</Title>
              {swaggerUrl ? (
                <>
                  <Select
                    label="Login Endpoint (POST)"
                    description="The endpoint used to login to your API"
                    placeholder="/v1/login"
                    searchable
                    clearable
                    required
                    data={postEndpoints ?? []}
                    {...apiAuthForm.getInputProps("loginEndpointId")}
                    onChange={(value) => {
                      apiAuthForm.setFieldValue(
                        "loginEndpointId",
                        value as string
                      );
                      setRequestBodyObject(
                        postEndpoints,
                        setLoginParameters,
                        value as string
                      );
                    }}
                  />
                  <Select
                    label="Refresh Endpoint (POST)"
                    description="The endpoint used to refresh your API token"
                    placeholder="/v1/login/refresh"
                    searchable
                    clearable
                    required
                    data={postEndpoints ?? []}
                    {...apiAuthForm.getInputProps("refreshEndpointId")}
                    onChange={(value) => {
                      apiAuthForm.setFieldValue(
                        "refreshEndpointId",
                        value as string
                      );
                    }}
                  />
                  <Select
                    label="User Endpoint (GET)"
                    description="The endpoint used to user information"
                    placeholder="/v1/user"
                    searchable
                    clearable
                    data={getEndpoints ?? []}
                    {...apiAuthForm.getInputProps("userEndpointId")}
                    onChange={(value) => {
                      apiAuthForm.setFieldValue(
                        "userEndpointId",
                        value as string
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <TextInputComponent
                    label="Login Endpoint (POST)"
                    description="The endpoint used to login to your API"
                    placeholder="/v1/login"
                    form={apiAuthForm}
                    propertyName="loginEndpointId"
                    required={true}
                  />
                  <TextInputComponent
                    label="Refresh Endpoint (POST)"
                    description="The endpoint used to refresh your API token"
                    placeholder="/v1/login/refresh"
                    form={apiAuthForm}
                    propertyName="refreshEndpointId"
                    required={true}
                  />
                  <TextInputComponent
                    label="User Endpoint (GET)"
                    description="The endpoint used to user information"
                    placeholder="/v1/user"
                    form={apiAuthForm}
                    propertyName="userEndpointId"
                    required={true}
                  />
                </>
              )}
              {dataSource?.swaggerUrl && loginEndpointId ? (
                <Select
                  label="Access token property"
                  description="The property name of the access token in the response"
                  placeholder="access"
                  searchable
                  clearable
                  nothingFound="Not found. Update your swagger to include the response property"
                  data={exampleResponse ?? []}
                  {...apiAuthForm.getInputProps("accessToken")}
                  onChange={(value) => {
                    apiAuthForm.setFieldValue("accessToken", value as string);
                  }}
                  required
                />
              ) : (
                <TextInputComponent
                  label="Access token property"
                  description="The property name of the access token in the response"
                  placeholder="access"
                  form={apiAuthForm}
                  propertyName="accessToken"
                  required={!!loginEndpointId}
                />
              )}
              {dataSource?.swaggerUrl && refreshEndpointId ? (
                <Select
                  label="Refresh token property"
                  description="The property name of the refresh token in the response"
                  placeholder="refresh"
                  searchable
                  clearable
                  nothingFound="Not found. Update your swagger to include the response property"
                  data={exampleResponse ?? []}
                  {...apiAuthForm.getInputProps("refreshToken")}
                  onChange={(value) => {
                    apiAuthForm.setFieldValue("refreshToken", value as string);
                  }}
                  required
                />
              ) : (
                <TextInputComponent
                  label="Refresh token property"
                  description="The property name of the refresh token in the response"
                  placeholder="refresh"
                  form={apiAuthForm}
                  propertyName="refreshToken"
                  required={!!refreshEndpointId}
                />
              )}
              {dataSource?.swaggerUrl && loginEndpointId ? (
                <Select
                  label="Access token expiry property"
                  description="The property name of the expiry of the access token in the response"
                  placeholder="expires_in"
                  searchable
                  clearable
                  nothingFound={
                    exampleResponse
                      ? "Not found. Update your swagger to include the response property"
                      : "No options"
                  }
                  data={exampleResponse ?? []}
                  {...apiAuthForm.getInputProps("expiryProperty")}
                  onChange={(value) => {
                    apiAuthForm.setFieldValue(
                      "expiryProperty",
                      value as string
                    );
                  }}
                  required
                />
              ) : (
                <TextInputComponent
                  label="Access token expiry property"
                  description="The property name of the expiry of the access token in the response"
                  placeholder="expires_in"
                  form={apiAuthForm}
                  propertyName="expiryProperty"
                  required={!!loginEndpointId}
                />
              )}
              <Flex>
                <Button type="submit">Save</Button>
              </Flex>
              <Divider></Divider>
              <Stack>
                <Title order={4} pt="lg">
                  Test Account Login
                </Title>
                {loginParameters?.map((parameter) => {
                  return (
                    <TextInput
                      key={parameter.name}
                      label={parameter.name}
                      placeholder={"Enter your " + parameter.name}
                      value={parameter.name}
                      type={parameter.type ? parameter.type : "text"}
                    />
                  );
                })}
              </Stack>
              <Stack>
                {dataSource?.changedEndpoints && (
                  <Title order={6}>Changed Endpoints</Title>
                )}
                <Title order={4} pt="lg">
                  API Endpoints
                </Title>
                {dataSource?.changedEndpoints?.map((endpoint) => {
                  return (
                    <DataSourceEndpoint
                      key={endpoint.id}
                      projectId={projectId}
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
                      projectId={projectId}
                      endpoint={endpoint}
                      location="datasource"
                    ></DataSourceEndpoint>
                  );
                })}
              </Stack>
            </Stack>
          </form>
        )}
      </Container>
    </Shell>
  );
}
