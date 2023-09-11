import {
  AuthenticationSchemes,
  DataSourceParams,
} from "@/requests/datasources/types";
import { isWebsite } from "@/utils/dashboardTypes";
import { Select, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export function validateBaseUrl(value: string | undefined) {
  if (!value) {
    return "Base URL is required";
  } else if (!isWebsite(value)) {
    return "Base URL must be valid and preferably start with https://";
  } else {
    return null;
  }
}

export function validateName(value: string | undefined) {
  if (!value) {
    return "Name is required";
  } else if (value.length > 30) {
    return "Name must be 30 characters or less";
  } else {
    return null;
  }
}

export const BasicDetailsInputs = ({
  form,
  authenticationScheme,
  setAuthenticationScheme,
}: {
  form: UseFormReturnType<DataSourceParams>;
  authenticationScheme?: AuthenticationSchemes | null;
  setAuthenticationScheme: (
    authenticationScheme: AuthenticationSchemes | null
  ) => void;
}) => {
  return (
    <>
      <TextInput
        label="API Description"
        description="The name of your API."
        placeholder="Internal API"
        {...form.getInputProps("name")}
      />
      <TextInput
        label="Base URL"
        description="The URL of of your API."
        placeholder="https://api.example.com"
        {...form.getInputProps("baseUrl")}
      />
      <Select
        label="Environment"
        description="The environment of your API."
        placeholder="Select environment"
        data={[
          { value: "Staging", label: "Staging" },
          { value: "Production", label: "Production" },
        ]}
        {...form.getInputProps("environment")}
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
        onChange={(value) => {
          form.setFieldValue(
            "authenticationScheme",
            value as AuthenticationSchemes
          );
          setAuthenticationScheme &&
            setAuthenticationScheme(value as AuthenticationSchemes);
        }}
      />
    </>
  );
};
