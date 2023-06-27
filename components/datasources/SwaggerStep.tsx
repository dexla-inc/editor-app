import { InformationAlert } from "@/components/Alerts";
import NextButton from "@/components/projects/NextButton";
import { createDataSource } from "@/requests/datasources/mutations";
import {
  DataSourceResponse,
  SwaggerDataSourceParams,
} from "@/requests/datasources/types";
import {
  LoadingStore,
  NextStepperClickEvent,
  isSwaggerFile,
  isWebsite,
} from "@/utils/dashboardTypes";
import { Anchor, Divider, Flex, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

export interface SwaggerStepProps extends LoadingStore, NextStepperClickEvent {
  setDataSource: (dataSource: DataSourceResponse) => void;
}

export default function SwaggerStep({
  nextStep,
  isLoading,
  startLoading,
  stopLoading,
  setDataSource,
}: SwaggerStepProps) {
  const router = useRouter();

  const projectId = router.query.id as string;

  const form = useForm<SwaggerDataSourceParams>({
    initialValues: {
      swaggerUrl: "",
    },
    validate: {
      swaggerUrl: (value) => {
        return !value
          ? "Swagger URL is required"
          : !isWebsite(value)
          ? "Swagger URL must be valid and preferably start with https://"
          : !isSwaggerFile(value)
          ? "Swagger URL must end with .json or .yaml"
          : null;
      },
    },
  });

  const onSubmit = async (values: SwaggerDataSourceParams) => {
    try {
      startLoading({
        id: "creating",
        title: "Creating Data Source",
        message: "Wait while your data source is being saved",
      });

      form.validate();

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
        <InformationAlert
          title="Let's get started!"
          text="Instead of manually adding your API endpoints, you can import via swagger to save you time. When you add new API endpoints you will just need to refetch. We can show you how to do this later."
        />
        <TextInput
          label="Swagger URL"
          description="Enter the URL of your Open API Swagger definition in JSON or YAML format so we can fetch your API endpoints, e.g. https://petstore.swagger.io/v2/swagger.json."
          placeholder="https://petstore.swagger.io/v2/swagger.json"
          {...form.getInputProps("swaggerUrl")}
        />
        <Divider></Divider>
        <Group position="right">
          <Flex gap="lg" align="end">
            <Anchor onClick={nextStep}>Continue without Swagger</Anchor>
            <NextButton
              isLoading={isLoading}
              disabled={isLoading}
              isSubmit={true}
            ></NextButton>
          </Flex>
        </Group>
      </Stack>
    </form>
  );
}
