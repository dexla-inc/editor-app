import { SuccessAlert } from "@/components/Alerts";
import { Shell } from "@/components/AppShell";
import {
  AuthenticationStepParams,
  filterAndMapEndpoints,
  getAuthEndpoint,
  patchDataSourceWithParams,
} from "@/components/datasources/AuthenticationInputs";
import {
  BasicDetailsInputs,
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import {
  SwaggerURLInput,
  validateSwaggerUrl,
} from "@/components/datasources/SwaggerURLInput";
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
  Box,
  Button,
  Container,
  Divider,
  Flex,
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

      apiAuthForm.setFieldValue("loginEndpointId", loginEndpoint?.id);
      apiAuthForm.setFieldValue(
        "accessToken",
        loginEndpoint?.authentication.tokenKey
      );
      apiAuthForm.setFieldValue("refreshEndpointId", refreshEndpoint?.id);
      apiAuthForm.setFieldValue(
        "refreshToken",
        refreshEndpoint?.authentication.tokenKey
      );
      apiAuthForm.setFieldValue("userEndpointId", userEndpoint?.id);

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

      await updateDataSource(projectId, dataSourceId, false, values);

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

  return (
    <Shell navbarType="project" user={user}>
      <Container py="xl">
        <form onSubmit={apiForm.onSubmit(onApiSubmit)}>
          <Stack>
            <Title>Data Source Details</Title>
            <Title order={3}>API Information</Title>
            <Box>
              {swaggerUrl && (
                <Button
                  onClick={refetchSwagger}
                  variant="light"
                  leftIcon={<IconRefresh size={ICON_SIZE} />}
                >
                  Refetch Swagger
                </Button>
              )}
            </Box>
            {swaggerRefetched && (
              <SuccessAlert
                title="Successfully Updated"
                text="Your API has been successfully. The editor will now show your updated API and API endpoints."
              ></SuccessAlert>
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
              <Select
                label="Login Endpoint (POST)"
                description="The endpoint used to login to your API"
                placeholder="/v1/login"
                searchable
                nothingFound="No options"
                data={postEndpoints}
                {...apiAuthForm.getInputProps("loginEndpointId")}
              />
              <Select
                label="Refresh Endpoint (POST)"
                description="The endpoint used to refresh your API token"
                placeholder="/v1/login/refresh"
                searchable
                nothingFound="No options"
                {...apiAuthForm.getInputProps("refreshEndpointId")}
                data={postEndpoints}
              />
              <Select
                label="User endpoint (GET)"
                description="The endpoint used to user information"
                placeholder="/v1/user"
                searchable
                nothingFound="No options"
                {...apiAuthForm.getInputProps("userEndpointId")}
                data={getEndpoints}
              />
              <TextInput
                label="Access token property"
                description="The property name of the access token in the response"
                placeholder="access"
                {...apiAuthForm.getInputProps("accessToken")}
              />
              <TextInput
                label="Refresh token property"
                description="The property name of the refresh token in the response"
                placeholder="refresh"
                {...apiAuthForm.getInputProps("refreshToken")}
              />
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
