import {
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { createDataSource } from "@/requests/datasources/mutations";
import { DataSourceParams } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import { Box, Button, Flex, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";

export default function ApiInfoFormNew() {
  const router = useRouter();
  const { id: projectId } = useEditorParams();

  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const form = useForm<DataSourceParams>({
    initialValues: {
      name: "",
      baseUrl: "",
      authenticationScheme: "NONE",
      environment: "Production",
      type: "API",
    },
    validate: {
      baseUrl: validateBaseUrl,
      name: validateName,
    },
  });

  const onSubmit = async (values: DataSourceParams) => {
    try {
      startLoading({
        id: "creating",
        title: "Creating Data Source",
        message: "Your datasource is saving",
      });

      const result = await createDataSource(projectId, "API", values);

      router.push(
        `/projects/${projectId}/settings/datasources/${result.id}?type=manual`,
      );

      if (!result) {
        throw new Error("Failed to create datasource");
      }
    } catch (error: any) {
      stopLoading({
        id: "creating",
        title: "Data Source Failed",
        message: error,
        isError: true,
      });
    } finally {
      stopLoading({
        id: "creating",
        title: "Data Source Saved",
        message: "The datasource was saved successfully",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="md">
        <Flex align="end" gap="md" justify="space-between"></Flex>
        <TextInput
          label="API Description"
          description="The name of your API."
          placeholder="Main API"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Base URL"
          description="The URL of your API."
          placeholder="https://api.example.com"
          {...form.getInputProps("baseUrl")}
        />
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
          {...form.getInputProps("authenticationScheme")}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit">Save</Button>
        </Box>
      </Stack>
    </form>
  );
}
