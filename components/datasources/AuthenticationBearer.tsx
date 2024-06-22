import BackButton from "@/components/BackButton";
import NextButton from "@/components/NextButton";
import {
  AuthenticationBearerTokenParams,
  ExampleResponseDropdown,
  filterAndMapEndpoints,
  getAuthEndpoint,
  mapEndpointExampleResponse,
  patchDataSourceWithParams,
  setEndpoint,
  setExampleResponseObject,
  setRequestBodyObject,
  validateTokenProperty,
} from "@/components/datasources/AuthenticationInputs";
import TextInputComponent from "@/components/datasources/TextInputComponent";
import { RequestBody } from "@/requests/datasources/types";
import { useDataSourceStore } from "@/stores/datasource";
import { DataSourceStepperProps } from "@/types/dashboardTypes";
import {
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  Select,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { InformationAlert } from "../Alerts";
import { useEndpoints } from "@/hooks/editor/reactQuery/useDataSourcesEndpoints";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

export interface BearerTokenAuthenticationProps extends DataSourceStepperProps {
  loginEndpointId: string | null;
  setLoginEndpointId: (loginEndpointId: string | null) => void;
  refreshEndpointId: string | null;
  setRefreshEndpointId: (refreshEndpointId: string | null) => void;
  userEndpointId: string | null;
  setUserEndpointId: (userEndpointId: string | null) => void;
  accessToken?: string | null;
  setAccessToken?: (accessToken: string | null) => void;
  refreshToken?: string | null;
  setRefreshToken?: (refreshToken: string | null) => void;
  setLoginEndpointLabel?: (loginEndpointLabel: string | null) => void;
  setRefreshEndpointLabel?: (refreshEndpointLabel: string | null) => void;
  setUserEndpointLabel?: (userEndpointLabel: string | null) => void;
  exampleResponse: ExampleResponseDropdown[] | undefined;
  setExampleResponse: (
    exampleResponse: ExampleResponseDropdown[] | undefined,
  ) => void;
  expiryProperty?: string | null;
  setExpiryProperty?: (expiryProperty: string | null) => void;
  setLoginRequestBody: (requestBody: RequestBody[] | undefined) => void;
  fromPage?: boolean;
}

export default function AuthenticationBearer({
  prevStep,
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  dataSource,
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
  expiryProperty,
  setExpiryProperty,
  setLoginRequestBody,
  fromPage,
}: BearerTokenAuthenticationProps) {
  const { id: projectId } = useEditorParams();
  const clearApiAuthConfig = useDataSourceStore(
    (state) => state.clearApiAuthConfig,
  );
  const { endpoints, invalidate } = useEndpoints(projectId, dataSource?.id);
  // May need to filter by dataSourceId

  const form = useForm<AuthenticationBearerTokenParams>({
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
  const postEndpoints = filterAndMapEndpoints(
    dataSource?.id ?? "",
    endpoints,
    "POST",
  );
  const getEndpoints = filterAndMapEndpoints(
    dataSource?.id ?? "",
    endpoints,
    "GET",
  );

  const onSubmit = async (values: AuthenticationBearerTokenParams) => {
    try {
      form.validate();

      if (Object.keys(form.errors).length > 0) {
        console.error("Errors: " + form.errors);
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
        expiryProperty,
      } = values;

      if (loginEndpointId !== undefined && accessToken !== undefined) {
        await patchDataSourceWithParams(
          projectId,
          dataSource.id,
          loginEndpointId,
          "ACCESS",
          accessToken,
          expiryProperty,
        );
      }

      if (refreshEndpointId !== undefined && refreshToken !== undefined) {
        await patchDataSourceWithParams(
          projectId,
          dataSource.id,
          refreshEndpointId,
          "REFRESH",
          refreshToken,
        );
      }

      if (userEndpointId) {
        await patchDataSourceWithParams(
          projectId,
          dataSource.id,
          userEndpointId,
          "USER",
        );
      }

      clearApiAuthConfig(dataSource.id);
      invalidate();

      nextStep && nextStep();

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
      setIsLoading && setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      stopLoading({
        id: "updating",
        title: "Data Source Failed",
        message: error,
        isError: true,
      });
      setIsLoading && setIsLoading(false);
    }
  };

  const setLoginEndpoint = (value: string) => {
    if (fromPage) {
      setLoginEndpointId(value);
      form.setFieldValue("loginEndpointId", value);
      setExampleResponseObject(postEndpoints, setExampleResponse, value);
      // Need to do a fetch on the auth data source before testing the user in [dataSourceId] page
      //const selectedEndpoint = endpoints?.find((option) => option.id === value);
      //setLoginEndpointObj(selectedEndpoint);
    } else {
      const selectedEndpoint = postEndpoints.find(
        (option) => option.value === value,
      );

      if (selectedEndpoint?.exampleresponse) {
        const exampleResponse = mapEndpointExampleResponse(
          selectedEndpoint.exampleresponse,
        );

        setExampleResponse(exampleResponse);
        setAccessToken && setAccessToken("");
        setExpiryProperty && setExpiryProperty("");
      }

      setEndpoint(
        setLoginEndpointId,
        selectedEndpoint,
        value,
        setLoginEndpointLabel,
      );
    }
  };

  const setRefreshEndpoint = (value: string) => {
    if (fromPage) {
      setRefreshEndpointId(value);
      form.setFieldValue("refreshEndpointId", value ?? "");
      setExampleResponseObject(postEndpoints, setExampleResponse, value ?? "");
    } else {
      const selectedEndpoint = postEndpoints.find(
        (option) => option.value === value,
      );
      setEndpoint(
        setRefreshEndpointId,
        selectedEndpoint,
        value,
        setRefreshEndpointLabel,
      );
      setRefreshToken && setRefreshToken("");
    }
  };

  const setUserEndpoint = (value: string) => {
    if (fromPage) {
      setUserEndpointId(value);
      form.setFieldValue("userEndpointId", value);
      setExampleResponseObject(postEndpoints, setExampleResponse, value);
    } else {
      const selectedEndpoint = getEndpoints.find(
        (option) => option.value === value,
      );
      setEndpoint(
        setUserEndpointId,
        selectedEndpoint,
        value,
        setUserEndpointLabel,
      );
    }
  };

  useEffect(() => {
    if (fromPage && endpoints) {
      const loginEndpoint = getAuthEndpoint("ACCESS", endpoints);
      const refreshEndpoint = getAuthEndpoint("REFRESH", endpoints);
      const userEndpoint = getAuthEndpoint("USER", endpoints);

      loginEndpoint?.id && setLoginEndpoint(loginEndpoint.id);
      refreshEndpoint?.id && setRefreshEndpoint(refreshEndpoint.id);
      userEndpoint?.id && setUserEndpoint(userEndpoint.id);

      form.setFieldValue("accessToken", loginEndpoint?.authentication.tokenKey);
      form.setFieldValue(
        "expiryProperty",
        loginEndpoint?.authentication.tokenSecondaryKey,
      );

      form.setFieldValue(
        "refreshToken",
        refreshEndpoint?.authentication.tokenKey,
      );

      setRequestBodyObject(
        postEndpoints,
        setLoginRequestBody,
        loginEndpoint?.id as string,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoints]);

  return (
    <form
      onSubmit={form.onSubmit(onSubmit)}
      onError={(error) => console.error(error)}
    >
      {endpoints && endpoints.length === 0 ? (
        <InformationAlert text="Add your login API endpoints first then configure this." />
      ) : (
        <Stack pb={fromPage ? "lg" : 100}>
          {endpoints && endpoints.length > 0 ? (
            <>
              <Select
                label="Login Endpoint (POST)"
                description="The endpoint used to login to your API"
                placeholder="/v1/login"
                searchable
                clearable
                required
                data={postEndpoints ?? []}
                {...(loginEndpointId
                  ? { value: loginEndpointId }
                  : { ...form.getInputProps("loginEndpointId") })}
                onChange={(value) => {
                  form.setFieldValue("loginEndpointId", value as string);
                  setLoginEndpoint(value ?? "");
                  setRequestBodyObject(
                    postEndpoints,
                    setLoginRequestBody,
                    value as string,
                  );
                }}
              />
              <Select
                label="Refresh Endpoint (POST)"
                description="The endpoint used to refresh your API token"
                placeholder="/v1/login/refresh"
                searchable
                clearable
                data={postEndpoints ?? []}
                {...(refreshEndpointId
                  ? { value: refreshEndpointId }
                  : { ...form.getInputProps("refreshEndpointId") })}
                onChange={(value) => {
                  form.setFieldValue("refreshEndpointId", value as string);
                  setRefreshEndpoint(value ?? "");
                }}
                //required
              />
              <Select
                label="User Endpoint (GET)"
                description="The endpoint used to user information"
                placeholder="/v1/user"
                searchable
                clearable
                data={getEndpoints ?? []}
                {...(userEndpointId
                  ? { value: userEndpointId }
                  : { ...form.getInputProps("userEndpointId") })}
                onChange={(value) => {
                  form.setFieldValue("userEndpointId", value as string);
                  setUserEndpoint(value ?? "");
                }}
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
          {endpoints && loginEndpointId ? (
            <Select
              label="Access token property"
              description="The property name of the access token in the response"
              placeholder="access"
              searchable
              clearable
              nothingFound="Not found. Update your swagger to include the response property"
              data={exampleResponse ?? []}
              {...(accessToken
                ? { value: accessToken }
                : { ...form.getInputProps("accessToken") })}
              onChange={(value) => {
                form.setFieldValue("accessToken", value as string);
                setAccessToken && setAccessToken(value);
              }}
              required
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
          {endpoints && refreshEndpointId ? (
            <Select
              label="Refresh token property"
              description="The property name of the refresh token in the response"
              placeholder="refresh"
              searchable
              clearable
              nothingFound="Not found. Update your swagger to include the response property"
              data={exampleResponse ?? []}
              {...(refreshToken
                ? { value: refreshToken }
                : { ...form.getInputProps("refreshToken") })}
              onChange={(value) => {
                form.setFieldValue("refreshToken", value as string);
                setRefreshToken && setRefreshToken(value);
              }}
              required={!!refreshEndpointId}
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
          {endpoints && loginEndpointId ? (
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
              {...(expiryProperty
                ? { value: expiryProperty }
                : { ...form.getInputProps("expiryProperty") })}
              onChange={(value) => {
                form.setFieldValue("expiryProperty", value as string);
                setExpiryProperty && setExpiryProperty(value);
              }}
              required
            />
          ) : (
            <TextInputComponent
              label="Access token expiry property"
              description="The property name of the expiry of the access token in the response"
              placeholder="expires_in"
              form={form}
              propertyName="expiryProperty"
              value={accessToken}
              setProperty={setExpiryProperty}
              required={!!loginEndpointId}
            />
          )}
          {fromPage ? (
            <Flex>
              <Button type="submit">Save</Button>
            </Flex>
          ) : (
            <>
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
            </>
          )}
        </Stack>
      )}
    </form>
  );
}
