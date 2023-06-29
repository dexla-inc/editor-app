import { DataSourceParams } from "@/requests/datasources/types";
import { isSwaggerFile, isWebsite } from "@/utils/dashboardTypes";
import { Loader, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export function validateSwaggerUrl(value: string | undefined) {
  if (!value) {
    return "Swagger URL is required";
  } else if (!isWebsite(value)) {
    return "Swagger URL must be valid and preferably start with https://";
  } else if (!isSwaggerFile(value)) {
    return "Swagger URL must end with .json or .yaml";
  } else {
    return null;
  }
}

export const SwaggerURLInput = ({
  isLoading,
  form,
}: {
  isLoading: boolean;
  form: UseFormReturnType<DataSourceParams>;
}) => {
  return (
    <TextInput
      label="Swagger URL"
      description="Enter the URL of your Open API Swagger definition in JSON or YAML format so we can fetch your API endpoints, e.g. https://petstore.swagger.io/v2/swagger.json."
      placeholder="https://petstore.swagger.io/v2/swagger.json"
      {...form.getInputProps("swaggerUrl")}
      rightSection={isLoading && <Loader size="xs" />}
      disabled={isLoading}
    />
  );
};
