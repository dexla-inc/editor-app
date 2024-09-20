import {
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { createDataSource } from "@/requests/datasources/mutations";
import { DataSourceParams } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { Box, Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DataSourceSupabaseForm() {
  const router = useRouter();
  const { id: projectId } = useEditorParams();

  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const accessToken = usePropelAuthStore.getState().accessToken;

  const form = useForm<DataSourceParams>({
    initialValues: {
      name: "",
      baseUrl: "",
      apiKey: "",
      authenticationScheme: "BEARER",
      environment: "Production",
      type: "SUPABASE",
      swaggerUrl: "",
    },
    validate: {
      baseUrl: validateBaseUrl,
      name: validateName,
      apiKey: (value: string | undefined) =>
        value?.trim().length === 0 ? "API Key is required" : null,
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: DataSourceParams) => {
    setErrorMessage(null);
    try {
      startLoading({
        id: "creating",
        title: "Creating Data Source",
        message: "Your datasource is being created",
      });

      // Make API call to swagger2openapi
      const swaggerResponse = await fetch(
        `/api/swagger2openapi?baseUrl=${encodeURIComponent(values.baseUrl as string)}&relativeUrl=/rest/v1/&apiKey=${encodeURIComponent(
          values.apiKey as string,
        )}&accessToken=${encodeURIComponent(accessToken)}&type=SUPABASE`,
      );

      if (!swaggerResponse.ok) {
        const errorData = await swaggerResponse.json();
        throw new Error(
          errorData.error || "Failed to convert Swagger to OpenAPI",
        );
      }

      const swaggerData = await swaggerResponse.json();
      const swaggerUrl = swaggerData.url;

      if (!swaggerUrl) {
        throw new Error("Swagger URL not returned from the API");
      }

      const dataSourceValues: DataSourceParams = {
        ...values,
        swaggerUrl: swaggerUrl,
      };

      const result = await createDataSource(projectId, dataSourceValues);

      if (!result || !result.id) {
        throw new Error("Failed to create datasource");
      }

      router.push(
        `/projects/${projectId}/settings/datasources/${result.id}?type=SUPABASE`,
      );
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An unexpected error occurred");
      stopLoading({
        id: "creating",
        title: "Data Source Failed",
        message: error.message || "Failed to create datasource",
        isError: true,
      });
    } finally {
      stopLoading({
        id: "creating",
        title: "Data Source Creation",
        message: "The datasource creation process has completed",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="md">
        {errorMessage && <Box sx={{ color: "red" }}>{errorMessage}</Box>}
        <TextInput
          label="Name"
          description="The name of your data source."
          placeholder="Main Data Source"
          {...form.getInputProps("name")}
          {...AUTOCOMPLETE_OFF_PROPS}
          required
        />
        <TextInput
          label="Base URL"
          description="The base URL of your Supabase project."
          placeholder="https://your-supabase-url.supabase.co"
          {...form.getInputProps("baseUrl")}
          required
        />
        <TextInput
          label="API Key"
          description="Your Supabase anon public API key."
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp...."
          {...form.getInputProps("apiKey")}
          required
        />
        <Group position="right">
          <Button type="submit">Save</Button>
        </Group>
      </Stack>
    </form>
  );
}
