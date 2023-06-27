import NextButton from "@/components/projects/NextButton";
import { createDataSource } from "@/requests/datasources/mutations";
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
      swaggerUrl: "",
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

      // Needs changing to update
      const result = await createDataSource(projectId, "API", values);
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
          defaultValue={dataSource?.name}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Base URL"
          description="The URL of of your API."
          placeholder="https://api.example.com"
          defaultValue={dataSource?.environment.baseUrl}
          {...form.getInputProps("baseUrl")}
        />
        <Select
          label="Environment"
          description="The environment of your API."
          placeholder="Select environment"
          defaultValue={dataSource?.environment.type}
          data={[
            { value: "Staging", label: "Staging" },
            { value: "Production", label: "Production" },
          ]}
          {...form.getInputProps("environment")}
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
