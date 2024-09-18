import { Icon } from "@/components/Icon";
import {
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { ApiFromAI } from "@/requests/datasources/types";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { Button, Flex, Select, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";

type Props = {
  api: ApiFromAI;
  title?: string;
};

export default function ApiInfoForm({ api, title }: Props) {
  const { id: projectId } = useEditorParams();

  const form = useForm<ApiFromAI>({
    validate: {
      baseUrl: (value) => validateBaseUrl(value),
      name: (value) => validateName(value),
    },
  });

  return (
    <Stack spacing="xl">
      <Flex align="end" gap="md" justify="space-between">
        <Title order={2}>
          {title ?? (api.name && `Building your ${api.name}`)}
        </Title>
        {api.apiDocsUrl && (
          <Button
            variant="outline"
            color="blue"
            leftIcon={<Icon name="IconExternalLink" />}
            component={Link}
            href={api.apiDocsUrl}
            target="_blank"
          >
            Open API Docs
          </Button>
        )}
      </Flex>
      {api.name && (
        <TextInput
          label="API Description"
          description="The name of your API."
          placeholder="Internal API"
          defaultValue={api.name}
          onChange={(event) => {
            form.setFieldValue("name", event.currentTarget.value);
          }}
          {...AUTOCOMPLETE_OFF_PROPS}
        />
      )}
      {api.baseUrl && (
        <TextInput
          label="Base URL"
          description="The URL of of your API."
          placeholder="https://api.example.com"
          defaultValue={api.baseUrl}
          onChange={(event) => {
            form.setFieldValue("baseUrl", event.currentTarget.value);
          }}
        />
      )}
      {api.authenticationScheme && (
        <Flex align="end" gap="md">
          <Select
            label="Authentication Scheme"
            description="The scheme used to authenticate endpoints"
            placeholder="Select an authentication scheme"
            data={[
              { value: "NONE", label: "None" },
              { value: "BEARER", label: "Bearer" },
              { value: "BASIC", label: "Basic" },
              { value: "API_KEY", label: "API Key" },
            ]}
            defaultValue={api.authenticationScheme}
            onChange={(value) => {
              form.setFieldValue("authenticationScheme", value as any);
            }}
            sx={{ flexGrow: 1 }}
          />
          {api.apiAuthTokenDocsUrl && (
            <Button
              variant="outline"
              color="blue"
              leftIcon={<Icon name="IconExternalLink" />}
              component={Link}
              href={api.apiAuthTokenDocsUrl}
              target="_blank"
            >
              Open API Auth Docs
            </Button>
          )}
        </Flex>
      )}
      {api.endpoints &&
        api.endpoints.map(
          (endpoint, index) =>
            endpoint.methodType && (
              <DataSourceEndpoint
                key={index}
                baseUrl={api.baseUrl}
                projectId={projectId}
                endpoint={endpoint as any}
                opened={true}
              ></DataSourceEndpoint>
            ),
        )}
    </Stack>
  );
}
