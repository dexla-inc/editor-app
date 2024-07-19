import { InformationAlert, WarningAlert } from "@/components/Alerts";
import BackButton from "@/components/BackButton";
import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { DataSourceEndpointList } from "@/components/datasources/DataSourceEndpointList";
import EndpointsButton from "@/components/datasources/EndpointsButton";
import { TestUserLogin } from "@/components/datasources/TestUserLogin";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import {
  AuthenticationSchemeLabels,
  RequestBody,
} from "@/requests/datasources/types";
import { DataSourceStepperWithoutNextProps } from "@/types/dashboardTypes";
import {
  Col,
  Divider,
  Grid,
  Group,
  GroupProps,
  Stack,
  Text,
  Title,
} from "@mantine/core";

interface AuthenticationStepParams extends DataSourceStepperWithoutNextProps {
  accessToken?: string | null;
  refreshToken?: string | null;
  loginEndpointLabel: string | null;
  refreshEndpointLabel: string | null;
  userEndpointLabel: string | null;
  expiryProperty: string | null;
  loginRequestBody: RequestBody[] | undefined;
  closeModal: any;
}

export default function EndpointsStep({
  prevStep,
  isLoading,
  startLoading,
  stopLoading,
  dataSource,
  loginEndpointLabel,
  refreshEndpointLabel,
  userEndpointLabel,
  accessToken,
  refreshToken,
  expiryProperty,
  loginRequestBody,
  closeModal,
}: AuthenticationStepParams) {
  const { id: projectId } = useEditorParams();

  return (
    <Stack mb={100}>
      <BackAndEndpointsButtonGroup
        dataSource={dataSource}
        prevStep={prevStep}
        projectId={projectId}
        startLoading={startLoading}
        stopLoading={stopLoading}
        isLoading={isLoading}
        mb="lg"
        closeModal={closeModal}
      />
      <InformationAlert
        title="Set Up Complete"
        text={
          dataSource?.authenticationScheme === "BEARER"
            ? "You have set up your API Data Source settings correctly. Login as a test user below so you can use your authenticated endpoints in the editor. You can view your API endpoints within the editor."
            : "You have set up your API Data Source settings correctly. You can create your API endpoints below."
        }
      />
      {dataSource?.authenticationScheme === "BEARER" && (
        <TestUserLogin
          projectId={projectId}
          dataSourceId={dataSource?.id}
          requestBody={loginRequestBody}
        ></TestUserLogin>
      )}
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
            <Text size="sm">API Name</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{dataSource?.name}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text size="sm">Base URL</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{dataSource?.baseUrl}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text size="sm">Environment</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">{dataSource?.environment}</Text>
          </Col>

          <Col span={4} fw={700}>
            <Text size="sm">Authentication Scheme</Text>
          </Col>
          <Col span={8}>
            <Text size="sm">
              {dataSource?.authenticationScheme &&
                AuthenticationSchemeLabels[dataSource.authenticationScheme]}
            </Text>
          </Col>
          {dataSource?.authenticationScheme === "BEARER" && (
            <>
              <Col span={4} fw={700}>
                <Text size="sm">Login Endpoint (POST)</Text>
              </Col>
              <Col span={8}>
                <Text size="sm">{loginEndpointLabel}</Text>
              </Col>

              <Col span={4} fw={700}>
                <Text size="sm">Refresh Endpoint (POST)</Text>
              </Col>
              <Col span={8}>
                <Text size="sm">{refreshEndpointLabel}</Text>
              </Col>

              <Col span={4} fw={700}>
                <Text size="sm">User Endpoint (GET)</Text>
              </Col>
              <Col span={8}>
                <Text size="sm">{userEndpointLabel}</Text>
              </Col>

              <Col span={4} fw={700}>
                <Text size="sm">Access Token Property</Text>
              </Col>
              <Col span={8}>
                <Text size="sm">{accessToken}</Text>
              </Col>

              <Col span={4} fw={700}>
                <Text size="sm">Refresh Token Property</Text>
              </Col>
              <Col span={8}>
                <Text size="sm">{refreshToken}</Text>
              </Col>

              <Col span={4} fw={700}>
                <Text size="sm">Access Token Expiry Property</Text>
              </Col>
              <Col span={8}>
                <Text size="sm">{expiryProperty}</Text>
              </Col>
            </>
          )}
          {dataSource?.authenticationScheme === "API_KEY" && (
            <>
              <Col span={4} fw={700}>
                <Text size="sm">API Key Value</Text>
              </Col>
              <Col span={8}>
                <Text size="sm">{accessToken}</Text>
              </Col>
            </>
          )}
        </Grid>

        <Divider></Divider>

        {dataSource?.swaggerUrl === "" && (
          <DataSourceEndpointList
            baseUrl={dataSource?.baseUrl}
            projectId={projectId}
            dataSourceId={dataSource?.id}
          />
        )}

        {dataSource?.changedEndpoints &&
          dataSource?.changedEndpoints.length > 0 && (
            <>
              <Title order={4} pt="lg">
                API Endpoints
              </Title>

              {dataSource?.changedEndpoints?.map((endpoint) => {
                return (
                  <DataSourceEndpoint
                    baseUrl={dataSource?.baseUrl}
                    key={endpoint.id}
                    projectId={projectId}
                    endpoint={endpoint}
                    location="datasource"
                  ></DataSourceEndpoint>
                );
              })}
              <BackAndEndpointsButtonGroup
                dataSource={dataSource}
                prevStep={prevStep}
                projectId={projectId}
                startLoading={startLoading}
                stopLoading={stopLoading}
                isLoading={isLoading}
                closeModal={closeModal}
              />
            </>
          )}
      </Stack>
    </Stack>
  );
}

export const BackAndEndpointsButtonGroup = ({
  dataSource,
  prevStep,
  projectId,
  startLoading,
  stopLoading,
  isLoading,
  closeModal,
  ...props
}: Pick<
  AuthenticationStepParams,
  | "dataSource"
  | "prevStep"
  | "startLoading"
  | "stopLoading"
  | "isLoading"
  | "closeModal"
> & { projectId: string } & GroupProps) => {
  return (
    <Group position="apart" {...props}>
      <BackButton
        onClick={() => {
          if (dataSource?.authenticationScheme === "NONE") {
            prevStep();
            prevStep();
          } else {
            prevStep();
          }
        }}
      ></BackButton>

      <EndpointsButton
        projectId={projectId}
        startLoading={startLoading}
        stopLoading={stopLoading}
        isLoading={isLoading}
        closeModal={closeModal}
      ></EndpointsButton>
    </Group>
  );
};
