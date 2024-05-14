import { updateDataSource } from "@/requests/datasources/mutations";
import {
  DataSourceParams,
  DataSourceResponse,
} from "@/requests/datasources/types";
import { validateBaseUrl, validateName } from "@/utils/validation";
import { Button, Flex, Select, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "../Icon";
import { SegmentedControlInput } from "../SegmentedControlInput";
import { validateSwaggerUrl } from "./SwaggerURLInput";
import { SwaggerURLInputRevised } from "./SwaggerURLInputRevised";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = {
  datasource: DataSourceResponse;
};

export const DataSourceForm = ({ datasource }: Props) => {
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<DataSourceParams>({
    validate: {
      swaggerUrl: (value) => (value ? validateSwaggerUrl(value) : null),
      baseUrl: (value) => validateBaseUrl(value),
      name: (value) => validateName(value),
      authValue: (value, values) =>
        values.authenticationScheme === "NONE"
          ? null
          : value === ""
          ? "You must provide an API key"
          : null,
    },
  });

  const onSubmit = async (values: DataSourceParams) => {
    try {
      setIsLoading(true);
      const update = await updateDataSource(
        projectId,
        datasource.id,
        false,
        values,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    form.setValues({
      name: datasource.name,
      swaggerUrl: datasource.swaggerUrl,
      baseUrl: datasource.baseUrl,
      environment: datasource.environment,
      authenticationScheme: datasource.authenticationScheme,
      authValue: datasource.authValue,
      apiKey: datasource.apiKey,
      type: datasource.type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasource]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Flex justify="space-between">
        <Title order={6}>Details</Title>
      </Flex>
      <Stack>
        <SegmentedControlInput
          label="Type"
          data={[
            { value: "API", label: "API" },
            { value: "SWAGGER", label: "Swagger" },
            { value: "SUPABASE", label: "Supabase" },
          ]}
          {...form.getInputProps("type")}
        />
        <SegmentedControlInput
          label="Environment"
          data={[
            { value: "Staging", label: "Staging" },
            { value: "Production", label: "Production" },
          ]}
          {...form.getInputProps("environment")}
        />
        {form.values.type === "SWAGGER" && (
          <SwaggerURLInputRevised
            datasourceId={datasource.id}
            updated={datasource.updated}
            {...form.getInputProps("swaggerUrl")}
          />
        )}
        <TextInput
          label="API Description"
          placeholder="Internal API"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Base URL"
          placeholder="https://api.example.com"
          {...form.getInputProps("baseUrl")}
        />
        <Select
          label="Authentication Scheme"
          placeholder="Select an authentication scheme"
          data={[
            { value: "NONE", label: "None" },
            { value: "BEARER", label: "Bearer" },
            { value: "BASIC", label: "Basic" },
            { value: "API_KEY", label: "API Key" },
          ]}
          {...form.getInputProps("authenticationScheme")}
          onChange={(value) => {
            form.setFieldValue("authenticationScheme", value as any);
          }}
        />
        {form.values.type === "SUPABASE" && (
          <TextInput
            label="API Key"
            description="(Optional)"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
            {...form.getInputProps("apiKey")}
          />
        )}
        {/* Need to add access and refresh token config */}
        <Button type="submit" loading={isLoading}>
          Save
        </Button>
        <Button
          component={Link}
          href="/projects/[id]/settings/datasources"
          as={`/projects/${projectId}/settings/datasources`}
          variant="default"
          target="_blank"
          rightIcon={<Icon name="IconExternalLink" />}
        >
          Configure
        </Button>
      </Stack>
    </form>
  );
};
