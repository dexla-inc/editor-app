import { DataSourceParams } from "@/requests/datasources/types";
import { isSwaggerFile } from "@/utils/validation";
import { isWebsite } from "@/utils/validation";
import { Loader, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export function validateSwaggerUrl(value: string | undefined) {
  if (!value) {
    return "Swagger URL is required";
  } else if (!isWebsite(value)) {
    return "Swagger URL must be valid and preferably start with https://";
  } else if (!isSwaggerFile(value)) {
    return "Swagger URL must end with .json, .yaml, or .yml";
  } else {
    return null;
  }
}
type SwaggerURLInputProps = {
  isLoading: boolean;
} & (
  | {
      form: UseFormReturnType<DataSourceParams>;
      swaggerUrl?: never;
      setSwaggerUrl?: never;
    }
  | {
      form?: never;
      swaggerUrl: string;
      setSwaggerUrl: (swaggerUrl: string) => void;
    }
);

export const SwaggerURLInput = ({
  isLoading,
  form,
  swaggerUrl,
  setSwaggerUrl,
}: SwaggerURLInputProps) => {
  return (
    <TextInput
      label="Swagger URL"
      description="Enter the URL of your Open API Swagger definition in JSON or YAML format so we can fetch your API endpoints, e.g. https://petstore.swagger.io/v2/swagger.json"
      placeholder="https://petstore.swagger.io/v2/swagger.json"
      {...(form
        ? form.getInputProps("swaggerUrl")
        : {
            value: swaggerUrl,
            onChange: (e) => setSwaggerUrl(e.target.value),
          })}
      rightSection={isLoading && <Loader size="xs" />}
      disabled={isLoading}
    />
  );
};
