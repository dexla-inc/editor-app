import { SuccessAlert } from "@/components/Alerts";
import { Shell } from "@/components/AppShell";
import {
  AuthenticationStepParams,
  ExampleResponseDropdown,
  filterAndMapEndpoints,
  getAuthEndpoint,
  patchDataSourceWithParams,
  setExampleResponseObject,
} from "@/components/datasources/AuthenticationInputs";
import {
  BasicDetailsInputs,
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import EndpointsButton from "@/components/datasources/EndpointsButton";
import SearchableSelectComponent from "@/components/datasources/SelectComponent";
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
} from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE } from "@/utils/config";
import {
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
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
  const [exampleResponse, setExampleResponse] = useState<
    ExampleResponseDropdown[] | undefined
  >(undefined);

  const postEndpoints = filterAndMapEndpoints(endpoints, "POST");
  const getEndpoints = filterAndMapEndpoints(endpoints, "GET");

  useEffect(() => {
    const fetch = async () => {
      const result = await getDataSource(projectId, dataSourceId);
      apiForm.setValues(result);
      setDataSource(result);
      setSwaggerUrl(result.swaggerUrl);
      setAuthenticationScheme(result.authenticationScheme);
    };

    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const result = await getDataSourceEndpoints(
        projectId,
        "API",
        dataSourceId
      );

      const loginEndpoint = getAuthEndpoint("ACCESS", result.results);
      const refreshEndpoint = getAuthEndpoint("REFRESH", result.results);
      const userEndpoint = getAuthEndpoint("USER", result.results);

      setLoginEndpoint(loginEndpoint?.id);
      setRefreshEndpoint(refreshEndpoint?.id);
      setUserEndpointId(userEndpoint?.id);

      apiAuthForm.setFieldValue(
        "accessToken",
        loginEndpoint?.authentication.tokenKey
      );
      apiAuthForm.setFieldValue(
        "refreshToken",
        refreshEndpoint?.authentication.tokenKey
      );

      setEndpoints(result.results);
    };

    fetch();
  }, []);

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
    },
    // validate: {
    //   accessToken: (value, values) =>
    //     validateTokenProperty("Access", value, values.loginEndpointId),
    //   refreshToken: (value, values) =>
    //     validateTokenProperty("Refresh", value, values.refreshEndpointId),
    // },
  });

  const onApiAuthSubmit = async (values: AuthenticationStepParams) => {
    console.log("values: " + JSON.stringify(values));
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
      } = values;

      await patchDataSourceWithParams(
        projectId,
        dataSource.type,
        dataSource.id,
        loginEndpointId as string,
        accessToken as string,
        "ACCESS"
      );

      await patchDataSourceWithParams(
        projectId,
        dataSource.type,
        dataSource.id,
        refreshEndpointId as string,
        refreshToken as string,
        "REFRESH"
      );

      if (userEndpointId) {
        await patchDataSourceWithParams(
          projectId,
          dataSource.type,
          dataSource.id,
          userEndpointId,
          null,
          "USER"
        );
      }

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
    } catch (error) {
      console.log(error);
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

      console.log(result);

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
    setExampleResponseObject(postEndpoints, setExampleResponse, value);
  };

  const setRefreshEndpoint = (value: string | undefined) => {
    setRefreshEndpointId(value);
    setExampleResponseObject(postEndpoints, setExampleResponse, value);
  };

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
                  <SearchableSelectComponent
                    label="Login Endpoint (POST)"
                    description="The endpoint used to login to your API"
                    placeholder="/v1/login"
                    value={loginEndpointId}
                    form={apiAuthForm}
                    propertyName="loginEndpointId"
                    data={postEndpoints}
                    setProperty={(value) => setLoginEndpoint(value ?? "")}
                  />
                  <SearchableSelectComponent
                    label="Refresh Endpoint (POST)"
                    description="The endpoint used to refresh your API token"
                    placeholder="/v1/login/refresh"
                    value={refreshEndpointId}
                    form={apiAuthForm}
                    propertyName="refreshEndpointId"
                    data={postEndpoints}
                    setProperty={(value) => setRefreshEndpoint(value ?? "")}
                  />
                  <SearchableSelectComponent
                    label="User Endpoint (GET)"
                    description="The endpoint used to user information"
                    placeholder="/v1/user"
                    form={apiAuthForm}
                    propertyName="userEndpointId"
                    data={getEndpoints}
                    value={userEndpointId}
                    setProperty={(value) => setUserEndpointId(value ?? "")}
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
                <SearchableSelectComponent
                  label="Access token property"
                  description="The property name of the access token in the response"
                  placeholder="access"
                  form={apiAuthForm}
                  propertyName="accessToken"
                  data={exampleResponse ?? []}
                  nothingFoundText="Not found. Update your swagger to include the response property"
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
                <SearchableSelectComponent
                  label="Refresh token property"
                  description="The property name of the refresh token in the response"
                  placeholder="refresh"
                  form={apiAuthForm}
                  propertyName="refreshToken"
                  data={exampleResponse ?? []}
                  nothingFoundText="Not found. Update your swagger to include the response property"
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

              <Flex>
                <Button type="submit">Save</Button>
              </Flex>
              <Divider></Divider>
            </Stack>
          </form>
        )}
      </Container>
    </Shell>
  );
}
