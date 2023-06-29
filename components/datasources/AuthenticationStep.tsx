import NextButton from "@/components/projects/NextButton";
import { patchDataSource } from "@/requests/datasources/mutations";
import { Endpoint } from "@/requests/datasources/types";
import { PatchParams } from "@/requests/types";
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

type AuthenticationStepParams = {
  loginEndpointId?: string | undefined;
  refreshEndpointId?: string | undefined;
  userEndpointId?: string | undefined;
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
};

interface AuthenticationStepProps extends DataSourceStepperProps {
  endpoints: Array<Endpoint> | undefined;
  loginEndpointId: string | null;
  setLoginEndpointId: (loginEndpointId: string | null) => void;
  setLoginEndpointLabel: (loginEndpointLabel: string | null) => void;
  setRefreshEndpointLabel: (refreshEndpointLabel: string | null) => void;
  setUserEndpointLabel: (userEndpointLabel: string | null) => void;
  refreshEndpointId: string | null;
  setRefreshEndpointId: (refreshEndpointId: string | null) => void;
  userEndpointId: string | null;
  setUserEndpointId: (userEndpointId: string | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string | null) => void;
}

export default function AuthenticationStep({
  prevStep,
  nextStep,
  isLoading,
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
    initialValues: {
      loginEndpointId: undefined,
      refreshEndpointId: undefined,
      userEndpointId: undefined,
      accessToken: undefined,
      refreshToken: undefined,
    },
    validate: {
      // set accessToken and refreshToken to required if loginEndpointId and refreshTokenEndpointId are set
      accessToken: (value, values) => {
        return values.loginEndpointId && values.refreshEndpointId && !value
          ? "Access token property is required"
          : null;
      },
      refreshToken: (value, values) => {
        return values.loginEndpointId && values.refreshEndpointId && !value
          ? "Refresh token property is required"
          : null;
      },
    },
  });

  const postEndpoints = [
    ...(
      endpoints
        ?.filter((c) => c.methodType === "POST")
        .map((c) => ({ value: c.id, label: c.relativeUrl })) || []
    ).sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const getEndpoints = [
    ...(
      endpoints
        ?.filter((c) => c.methodType === "GET")
        .map((c) => ({ value: c.id, label: c.relativeUrl })) || []
    ).sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const onSubmit = async (values: AuthenticationStepParams) => {
    try {
      form.validate();

      if (Object.keys(form.errors).length > 0) {
        console.log(form.errors);
        return;
      }

      if (!dataSource?.id) {
        throw new Error("Can't find data source");
      }

      startLoading({
        id: "creating",
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

      if (loginEndpointId !== undefined && accessToken !== undefined) {
        const loginPatchParams: PatchParams[] = [
          {
            op: "replace",
            path: "/authentication/endpointType",
            value: "ACCESS",
          },
          {
            op: "replace",
            path: "/authentication/tokenKey",
            value: accessToken,
          },
        ];

        await patchDataSource(
          projectId,
          dataSource.type,
          dataSource.id,
          loginEndpointId,
          loginPatchParams
        );
      }

      if (refreshEndpointId !== undefined && refreshToken !== undefined) {
        const refreshPatchParams: PatchParams[] = [
          {
            op: "replace",
            path: "/authentication/endpointType",
            value: "REFRESH",
          },
          {
            op: "replace",
            path: "/authentication/tokenKey",
            value: refreshToken,
          },
        ];

        await patchDataSource(
          projectId,
          dataSource.type,
          dataSource.id,
          refreshEndpointId,
          refreshPatchParams
        );
      }

      if (userEndpointId) {
        const getUserPatchParams: PatchParams[] = [
          {
            op: "replace",
            path: "/authentication/endpointType",
            value: "USER",
          },
        ];

        await patchDataSource(
          projectId,
          dataSource.type,
          dataSource.id,
          userEndpointId,
          getUserPatchParams
        );
      }

      nextStep();

      stopLoading({
        id: "creating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setLoginEndpoint = (value: string | null) => {
    setLoginEndpointId(value);
    const selectedOption = postEndpoints.find(
      (option) => option.value === value
    )?.label;
    console.log(selectedOption);
    setLoginEndpointLabel(selectedOption as string);
  };

  const setRefreshEndpoint = (value: string | null) => {
    setRefreshEndpointId(value);
    const selectedOption = postEndpoints.find(
      (option) => option.value === value
    )?.label;
    console.log(selectedOption);
    setRefreshEndpointLabel(selectedOption as string);
  };

  const setUserEndpoint = (value: string | null) => {
    setUserEndpointId(value);
    const selectedOption = getEndpoints.find(
      (option) => option.value === value
    )?.label;
    console.log(value);
    setUserEndpointLabel(selectedOption as string);
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Select
          label="Login Endpoint (POST)"
          description="The endpoint used to login to your API"
          placeholder="/v1/login"
          data={postEndpoints}
          searchable
          value={loginEndpointId}
          onChange={(value) => setLoginEndpoint(value)}
        />
        <Select
          label="Refresh Endpoint (POST)"
          description="The endpoint used to refresh your API token"
          placeholder="/v1/login/refresh"
          data={postEndpoints}
          searchable
          value={refreshEndpointId}
          onChange={(value) => setRefreshEndpoint(value)}
        />
        <Select
          label="User endpoint (GET)"
          description="The endpoint used to user information"
          placeholder="/v1/user"
          data={getEndpoints}
          searchable
          value={userEndpointId}
          onChange={(value) => setUserEndpoint(value)}
        />
        <TextInput
          label="Access token property"
          description="The property name of the access token in the response"
          placeholder="access"
          value={accessToken || ""}
          onChange={(event) => setAccessToken(event.currentTarget.value)}
        />
        <TextInput
          label="Refresh token property"
          description="The property name of the refresh token in the response"
          placeholder="refresh"
          value={refreshToken || ""}
          onChange={(event) => setRefreshToken(event.currentTarget.value)}
        />
        <Divider></Divider>
        <Group position="apart">
          <BackButton onClick={prevStep}></BackButton>
          <Flex gap="lg" align="end">
            <Anchor onClick={nextStep}>
              Skip, I use an external auth provider
            </Anchor>
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
