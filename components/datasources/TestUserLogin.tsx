import { ErrorAlert, SuccessAlert } from "@/components/Alerts";
import { getDataSourceAuth } from "@/requests/datasources/queries";
import {
  DataSourceAuthResponse,
  RequestBody,
} from "@/requests/datasources/types";
import { useDataSourceStore } from "@/stores/datasource";
import { Button, Stack, TextInput, Title } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
  dataSourceId: string | undefined;
  url?: string;
  requestBody?: RequestBody[];
};

export const TestUserLogin = ({
  projectId,
  dataSourceId,
  requestBody,
  url,
}: Props) => {
  const [testLoginValues, setTestLogin] = useState({});
  const handleInputChange = (name: string, value: string) => {
    setTestLogin({ ...testLoginValues, [name]: value });
  };
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | undefined>(
    undefined,
  );

  const [dataSourceAuthConfig, setDataSourceAuthConfig] =
    useState<Record<string, Omit<DataSourceAuthResponse, "type">>>();

  useEffect(() => {
    const fetchDataSourceAuthConfig = async () => {
      const config = await getDataSourceAuth(projectId);

      setDataSourceAuthConfig(config);
    };

    fetchDataSourceAuthConfig();
  }, [projectId, dataSourceId]);

  const handleLoginClick = async () => {
    const loginUrl =
      dataSourceAuthConfig?.[dataSourceId || ""].accessTokenUrl ?? "";

    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testLoginValues),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      console.error(
        "Failed to log in:",
        response.status,
        response.statusText,
        responseJson.message,
      );
      setUserLoggedIn(false);
      return;
    }

    const mergedAuthConfig = { ...responseJson, ...dataSourceAuthConfig };

    const setAuthTokens = useDataSourceStore.getState().setAuthTokens;
    setAuthTokens(dataSourceId ?? "", mergedAuthConfig);

    setUserLoggedIn(true);
  };

  return (
    <Stack spacing="xs" py="xl">
      <Title order={4}>Test Account Login</Title>
      {!dataSourceAuthConfig?.[dataSourceId || ""]?.accessTokenUrl && (
        <ErrorAlert
          title="Set up your login URL"
          text="You need to set up your login URL in the data source settings before you can test your login."
        />
      )}
      {requestBody?.map((parameter) => (
        <TextInput
          key={parameter.name}
          label={parameter.name}
          placeholder={`Enter your ${parameter.name}`}
          type={
            parameter.name.includes("password")
              ? "password"
              : parameter.name.includes("email")
                ? "email"
                : "text"
          }
          onChange={(event) =>
            handleInputChange(parameter.name, event.currentTarget.value)
          }
        />
      ))}
      <Button onClick={handleLoginClick} color="indigo" sx={{ width: "80px" }}>
        Login
      </Button>
      {userLoggedIn === true ? (
        <SuccessAlert
          title="User Logged In"
          text="You can now use your authenticated endpoints within the editor"
        />
      ) : (
        userLoggedIn === false && (
          <ErrorAlert
            title="Login Failed"
            text="Please check your credentials and try again"
          />
        )
      )}
    </Stack>
  );
};
