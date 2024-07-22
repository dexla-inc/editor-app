import {
  ApiFromAI,
  AuthenticationSchemes,
  DataSourceParams,
  EnvironmentTypes,
} from "@/requests/datasources/types";
import { isWebsite } from "@/types/dashboardTypes";
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

type Props<T extends DataSourceParams | ApiFromAI> = {
  form: UseFormReturnType<T>;
  authenticationScheme?: AuthenticationSchemes | null;
  setAuthenticationScheme?: (
    authenticationScheme: AuthenticationSchemes,
  ) => void;
};

export const BasicDetailsInputs = <T extends DataSourceParams | ApiFromAI>({
  form,
  setAuthenticationScheme,
}: Props<T>) => {
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
        data={environmentOptions}
        {...form.getInputProps("environment")}
      />
      <Select
        label="Authentication Scheme"
        description="The scheme used to authenticate endpoints"
        placeholder="Select an authentication scheme"
        data={authSchemeOptions}
        {...form.getInputProps("authenticationScheme")}
        onChange={(value) => {
          form.setFieldValue("authenticationScheme", value as any);
          setAuthenticationScheme &&
            setAuthenticationScheme(value as AuthenticationSchemes);
        }}
      />
    </>
  );
};

type EnvironmentOption = {
  value: Exclude<EnvironmentTypes, "None">;
  label: string;
};

export const environmentOptions: EnvironmentOption[] = [
  { value: "Staging", label: "Staging" },
  { value: "Production", label: "Production" },
];

type AuthSchemeOption = {
  value: AuthenticationSchemes;
  label: string;
};

export const authSchemeOptions: AuthSchemeOption[] = [
  { value: "NONE", label: "None" },
  { value: "BEARER", label: "Bearer" },
  { value: "BASIC", label: "Basic" },
  { value: "API_KEY", label: "API Key" },
];
