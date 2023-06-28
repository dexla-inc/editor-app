import NextButton from "@/components/projects/NextButton";
import { updateDataSource } from "@/requests/datasources/mutations";
import {
  DataSourceResponse,
  SwaggerDataSourceParams,
} from "@/requests/datasources/types";
import {
  LoadingStore,
  NextStepperClickEvent,
  PreviousStepperClickEvent,
  isWebsite,
} from "@/utils/dashboardTypes";
import { Divider, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import BackButton from "../projects/BackButton";

export interface BasicDetailsStepProps
  extends LoadingStore,
    NextStepperClickEvent,
    PreviousStepperClickEvent {
  dataSource: DataSourceResponse | undefined;
  setDataSource: (dataSource: DataSourceResponse) => void;
}

export default function BasicDetailsStep({
  prevStep,
  nextStep,
  isLoading,
  startLoading,
  stopLoading,
  dataSource,
  setDataSource,
}: BasicDetailsStepProps) {
  const router = useRouter();
  const projectId = router.query.id as string;

  const form = useForm<SwaggerDataSourceParams>({
    initialValues: {
      name: dataSource?.name || "",
      baseUrl: dataSource?.baseUrl || "",
      environment: dataSource?.environment || "",
      authenticationScheme: dataSource?.authenticationScheme || "",
      swaggerUrl: dataSource?.swaggerUrl || "",
    },
    validate: {
      baseUrl: (value) => {
        return !value
          ? "Base URL is required"
          : !isWebsite(value)
          ? "Base URL must be valid and preferably start with https://"
          : null;
      },
    },
  });

  const onSubmit = async (values: SwaggerDataSourceParams) => {
    try {
      startLoading({
        id: "creating",
        title: "Updating Data Source",
        message: "Wait while your data source is being saved",
      });

      form.validate();

      if (!dataSource?.id) {
        throw new Error("Can't find data source");
      }

      const result = await updateDataSource(
        projectId,
        dataSource.id,
        false,
        values
      );

      if (!result) {
        throw new Error("Failed to update data source");
      }

      setDataSource(result);

      nextStep();

      stopLoading({
        id: "creating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Name"
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
        />
        <Divider></Divider>
        <Group position="apart">
          <BackButton onClick={prevStep}></BackButton>
          <NextButton
            isLoading={isLoading}
            disabled={isLoading}
            isSubmit={true}
          ></NextButton>
        </Group>
      </Stack>
    </form>
  );
}
