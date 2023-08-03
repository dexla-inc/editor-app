import { InformationAlert, WarningAlert } from "@/components/Alerts";
import BackButton from "@/components/BackButton";
import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import EndpointsButton from "@/components/datasources/EndpointsButton";
import { getPageList } from "@/requests/pages/queries";
import { DataSourceStepperWithoutNextProps } from "@/utils/dashboardTypes";
import { Col, Divider, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";

interface AuthenticationStepParams extends DataSourceStepperWithoutNextProps {
  accessToken?: string | null;
  refreshToken?: string | null;
  loginEndpointLabel: string | null;
  refreshEndpointLabel: string | null;
  userEndpointLabel: string | null;
  expiryProperty: string | null;
}

export default function EndpointsStep({
  prevStep,
  isLoading,
  startLoading,
  stopLoading,
  dataSource,
  setDataSource,
  loginEndpointLabel,
  refreshEndpointLabel,
  userEndpointLabel,
  accessToken,
  refreshToken,
  expiryProperty,
}: AuthenticationStepParams) {
  const router = useRouter();
  const projectId = router.query.id as string;

  const goToEditor = async (projectId: string) => {
    startLoading({
      id: "endpoints-step",
      title: "Editor Is Loading",
      message: "Wait while the editor is loading",
    });

    const result = await getPageList(projectId, { isHome: true });

    router.push(`/projects/${projectId}/editor/${result.results[0].id}`);
  };

  return (
    <Stack sx={{ marginBottom: 100 }}>
      <InformationAlert
        title="Set Up Complete"
        text="You have setup your API Data Source settings correctly and they are ready to use. You can view your API endpoints within the editor."
      />
      <WarningAlert title="CORS Action Required" isHtml>
        <Text>
          Please add&nbsp;
          <span style={{ fontWeight: 700 }}>*.dexla.ai&nbsp;</span>
          to your allowed hosts to prevent CORS issues with your API when
          building your project within the editor
        </Text>
      </WarningAlert>
      <Stack>
        <Grid gutter="md">
          <Col span={4} fw={700}>
            <Text>API Name</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{dataSource?.name}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>Base URL</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{dataSource?.baseUrl}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>Environment</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{dataSource?.environment}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>Authentication Scheme</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{dataSource?.authenticationScheme}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>Login Endpoint (POST)</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{loginEndpointLabel}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>Refresh Endpoint (POST)</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{refreshEndpointLabel}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>User Endpoint (GET)</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{userEndpointLabel}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>Access Token Property</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{accessToken}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>Refresh Token Property</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{refreshToken}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text>Access Token Expiry Property</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{expiryProperty}</Text>
          </Col>
        </Grid>

        <Divider></Divider>
        <Group position="apart">
          <BackButton onClick={prevStep}></BackButton>
          <EndpointsButton
            projectId={projectId}
            startLoading={startLoading}
            stopLoading={stopLoading}
            isLoading={isLoading}
          ></EndpointsButton>
        </Group>
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
        <Group position="apart">
          <BackButton onClick={prevStep}></BackButton>
          <EndpointsButton
            projectId={projectId}
            startLoading={startLoading}
            stopLoading={stopLoading}
            isLoading={isLoading}
            text="Go to Editor"
          ></EndpointsButton>
        </Group>
      </Stack>
    </Stack>
  );
}
