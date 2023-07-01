import {
  AuthenticationStepParams,
  ExampleResponseDropdown,
  filterAndMapEndpoints,
  mapEndpointExampleResponse,
  patchDataSourceWithParams,
  setEndpoint,
  validateTokenProperty,
} from "@/components/datasources/AuthenticationInputs";
import SearchableSelectComponent from "@/components/datasources/SelectComponent";
import TextInputComponent from "@/components/datasources/TextInputComponent";
import NextButton from "@/components/projects/NextButton";
import { Endpoint } from "@/requests/datasources/types";
import { DataSourceStepperProps } from "@/utils/dashboardTypes";
import { Anchor, Divider, Flex, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import BackButton from "../projects/BackButton";

interface AuthenticationStepProps extends DataSourceStepperProps {
  endpoints: Array<Endpoint> | undefined;
  loginEndpointId: string | null;
  setLoginEndpointId: (loginEndpointId: string | null) => void;
  refreshEndpointId: string | null;
  setRefreshEndpointId: (refreshEndpointId: string | null) => void;
  userEndpointId: string | null;
  setUserEndpointId: (userEndpointId: string | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string | null) => void;
  setLoginEndpointLabel: (loginEndpointLabel: string | null) => void;
  setRefreshEndpointLabel: (refreshEndpointLabel: string | null) => void;
  setUserEndpointLabel: (userEndpointLabel: string | null) => void;
  exampleResponse: ExampleResponseDropdown[] | undefined;
  setExampleResponse: (
    exampleResponse: ExampleResponseDropdown[] | undefined
  ) => void;
}

export default function AuthenticationStep({
  prevStep,
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  dataSource,
  endpoints,
  loginEndpointId,
  setLoginEndpointId,
  setLoginEndpointLabel,
  setRefreshEndpointLabel,
  setUserEndpointLabel,
  refreshEndpointId,
  setRefreshEndpointId,
  userEndpointId,
  setUserEndpointId,
  accessToken,
  setAccessToken,
  refreshToken,
  setRefreshToken,
  setExampleResponse,
  exampleResponse,
}: AuthenticationStepProps) {
  const router = useRouter();
  const projectId = router.query.id as string;

  const form = useForm<AuthenticationStepParams>({
    validateInputOnBlur: true,
    initialValues: {
      loginEndpointId: undefined,
      refreshEndpointId: undefined,
      userEndpointId: undefined,
      accessToken: undefined,
      refreshToken: undefined,
    },
    validate: {
      accessToken: (value, values) =>
        validateTokenProperty("Access", value, values.loginEndpointId),
      refreshToken: (value, values) =>
        validateTokenProperty("Refresh", value, values.refreshEndpointId),
    },
  });

  const postEndpoints = filterAndMapEndpoints(endpoints, "POST");
  const getEndpoints = filterAndMapEndpoints(endpoints, "GET");

  const onSubmit = async (values: AuthenticationStepParams) => {
    try {
      form.validate();

      if (Object.keys(form.errors).length > 0) {
        console.log("Errors: " + form.errors);
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

      setIsLoading && setIsLoading(true);

      const {
        loginEndpointId,
        refreshEndpointId,
        userEndpointId,
        accessToken,
        refreshToken,
      } = values;

      if (loginEndpointId !== undefined && accessToken !== undefined) {
        await patchDataSourceWithParams(
          projectId,
          dataSource.type,
          dataSource.id,
          loginEndpointId,
          accessToken,
          "ACCESS"
        );
      }

      if (refreshEndpointId !== undefined && refreshToken !== undefined) {
        await patchDataSourceWithParams(
          projectId,
          dataSource.type,
          dataSource.id,
          refreshEndpointId,
          refreshToken,
          "REFRESH"
        );
      }

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

      nextStep();

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
      setIsLoading && setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setLoginEndpoint = (value: string) => {
    const selectedEndpoint = postEndpoints.find(
      (option) => option.value === value
    );

    const result = mapEndpointExampleResponse(
      selectedEndpoint?.exampleresponse
    );
    setExampleResponse(result);

    setEndpoint(
      setLoginEndpointId,
      selectedEndpoint,
      value,
      setLoginEndpointLabel
    );
  };

  const setRefreshEndpoint = (value: string | null) => {
    const selectedEndpoint = postEndpoints.find(
      (option) => option.value === value
    );
    setEndpoint(
      setRefreshEndpointId,
      selectedEndpoint,
      value,
      setRefreshEndpointLabel
    );
  };

  const setUserEndpoint = (value: string | null) => {
    const selectedEndpoint = getEndpoints.find(
      (option) => option.value === value
    );
    setEndpoint(
      setUserEndpointId,
      selectedEndpoint,
      value,
      setUserEndpointLabel
    );
  };

  return (
    <form
      onSubmit={form.onSubmit(onSubmit)}
      onError={(error) => console.log(error)}
    >
      <Stack>
        {dataSource?.swaggerUrl ? (
          <>
            <SearchableSelectComponent
              label="Login Endpoint (POST)"
              description="The endpoint used to login to your API"
              placeholder="/v1/login"
              value={loginEndpointId}
              form={form}
              propertyName="loginEndpointId"
              data={postEndpoints}
              setProperty={(value) => setLoginEndpoint(value ?? "")}
            />
            <SearchableSelectComponent
              label="Refresh Endpoint (POST)"
              description="The endpoint used to refresh your API token"
              placeholder="/v1/login/refresh"
              value={refreshEndpointId}
              form={form}
              propertyName="refreshEndpointId"
              data={postEndpoints}
              setProperty={(value) => setRefreshEndpoint(value ?? "")}
            />
            <SearchableSelectComponent
              label="User Endpoint (GET)"
              description="The endpoint used to user information"
              placeholder="/v1/user"
              value={userEndpointId}
              form={form}
              propertyName="userEndpointId"
              data={getEndpoints}
              setProperty={(value) => setUserEndpoint(value ?? "")}
            />
          </>
        ) : (
          <>
            <TextInputComponent
              label="Login Endpoint (POST)"
              description="The endpoint used to login to your API"
              placeholder="/v1/login"
              value={loginEndpointId}
              form={form}
              propertyName="loginEndpointId"
              setProperty={(value) => setLoginEndpoint(value ?? "")}
            />
            <TextInputComponent
              label="Refresh Endpoint (POST)"
              description="The endpoint used to refresh your API token"
              placeholder="/v1/login/refresh"
              value={refreshEndpointId}
              form={form}
              propertyName="refreshEndpointId"
              setProperty={(value) => setRefreshEndpoint(value ?? "")}
            />

            <TextInputComponent
              label="User Endpoint (GET)"
              description="The endpoint used to user information"
              placeholder="/v1/user"
              value={userEndpointId}
              form={form}
              propertyName="userEndpointId"
              setProperty={(value) => setUserEndpoint(value ?? "")}
            />
          </>
        )}
        {dataSource?.swaggerUrl && loginEndpointId ? (
          <SearchableSelectComponent
            label="Access token property"
            description="The property name of the access token in the response"
            placeholder="access"
            value={accessToken}
            form={form}
            propertyName="accessToken"
            data={exampleResponse ?? []}
            setProperty={setAccessToken}
            nothingFoundText="Not found. Update your swagger to include the response property"
          />
        ) : (
          <TextInputComponent
            label="Access token property"
            description="The property name of the access token in the response"
            placeholder="access"
            form={form}
            propertyName="accessToken"
            value={accessToken}
            setProperty={setAccessToken}
            required={!!loginEndpointId}
          />
        )}
        {dataSource?.swaggerUrl && refreshEndpointId ? (
          <SearchableSelectComponent
            label="Refresh token property"
            description="The property name of the refresh token in the response"
            placeholder="refresh"
            value={refreshToken}
            form={form}
            propertyName="refreshToken"
            data={exampleResponse ?? []}
            setProperty={setRefreshToken}
            nothingFoundText="Not found. Update your swagger to include the response property"
          />
        ) : (
          <TextInputComponent
            label="Refresh token property"
            description="The property name of the refresh token in the response"
            placeholder="refresh"
            form={form}
            propertyName="refreshToken"
            value={refreshToken}
            setProperty={setRefreshToken}
            required={!!refreshEndpointId}
          />
        )}
        <Divider></Divider>
        <Group position="apart">
          <BackButton onClick={prevStep}></BackButton>
          <Flex gap="lg" align="end">
            {!isLoading && (
              <Anchor onClick={nextStep}>
                Skip, I use an external auth provider
              </Anchor>
            )}
            <NextButton
              isLoading={isLoading}
              disabled={isLoading}
              isSubmit={true}
            ></NextButton>
          </Flex>
        </Group>
      </Stack>
    </form>
  );
}
