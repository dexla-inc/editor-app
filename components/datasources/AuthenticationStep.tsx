import {
  AuthenticationStepParams,
  filterAndMapEndpoints,
  patchDataSourceWithParams,
  setEndpoint,
  validateTokenProperty,
} from "@/components/datasources/AuthenticationInputs";
import NextButton from "@/components/projects/NextButton";
import { Endpoint } from "@/requests/datasources/types";
import { DataSourceStepperProps } from "@/utils/dashboardTypes";
import {
  Anchor,
  Divider,
  Flex,
  Group,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
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

      console.log("authsteploginEndpointId: " + loginEndpointId);
      console.log("authstepaccessToken: " + accessToken);
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
    setEndpoint(
      setLoginEndpointId,
      postEndpoints,
      value,
      setLoginEndpointLabel
    );
  };

  const setRefreshEndpoint = (value: string | null) => {
    setEndpoint(
      setRefreshEndpointId,
      postEndpoints,
      value,
      setRefreshEndpointLabel
    );
  };

  const setUserEndpoint = (value: string | null) => {
    setEndpoint(setUserEndpointId, getEndpoints, value, setUserEndpointLabel);
  };

  return (
    <form
      onSubmit={form.onSubmit(onSubmit)}
      onError={(error) => console.log(error)}
    >
      <Stack>
        <Select
          label="Login Endpoint (POST)"
          description="The endpoint used to login to your API"
          placeholder="/v1/login"
          searchable
          nothingFound="No options"
          onChange={(value) => {
            setLoginEndpoint(value ?? "");
            form.getInputProps("loginEndpointId").onChange(value);
          }}
          defaultValue={loginEndpointId}
          data={postEndpoints}
        />
        <Select
          label="Refresh Endpoint (POST)"
          description="The endpoint used to refresh your API token"
          placeholder="/v1/login/refresh"
          searchable
          onChange={(value) => {
            setRefreshEndpoint(value ?? "");
            form.getInputProps("refreshEndpointId").onChange(value);
          }}
          defaultValue={refreshEndpointId}
          data={postEndpoints}
        />
        <Select
          label="User endpoint (GET)"
          description="The endpoint used to user information"
          placeholder="/v1/user"
          searchable
          onChange={(value) => {
            setUserEndpoint(value ?? "");
            form.getInputProps("userEndpointId").onChange(value);
          }}
          defaultValue={userEndpointId}
          data={getEndpoints}
        />
        <TextInput
          label="Access token property"
          description="The property name of the access token in the response"
          placeholder="access"
          value={accessToken || ""}
          onChange={(event) => {
            setAccessToken(event.currentTarget.value);
            form
              .getInputProps("accessToken")
              .onChange(event.currentTarget.value);
          }}
        />
        <TextInput
          label="Refresh token property"
          description="The property name of the refresh token in the response"
          placeholder="refresh"
          value={refreshToken || ""}
          onChange={(event) => {
            setRefreshToken(event.currentTarget.value);
            form
              .getInputProps("refreshToken")
              .onChange(event.currentTarget.value);
          }}
        />
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
