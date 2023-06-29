import { InformationAlert } from "@/components/Alerts";
import NextButton from "@/components/projects/NextButton";
import { createDataSource } from "@/requests/datasources/mutations";
import {
  DataSourceResponse,
  Endpoint,
  SwaggerDataSourceParams,
  SwaggerParams,
} from "@/requests/datasources/types";
import {
  DataSourceStepperWithoutPreviousProps,
  areValuesEqual,
  isSwaggerFile,
  isWebsite,
} from "@/utils/dashboardTypes";
import {
  Anchor,
  Divider,
  Flex,
  Group,
  Loader,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

export default function SwaggerStep({
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  dataSource,
  setDataSource,
  setEndpoints,
}: DataSourceStepperWithoutPreviousProps & {
  setEndpoints: (endpoints: Endpoint[]) => void;
}) {
  const router = useRouter();

  const projectId = router.query.id as string;

  const form = useForm<SwaggerDataSourceParams>({
    initialValues: {
      swaggerUrl: dataSource?.swaggerUrl || "",
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
      const pickedValues: Pick<SwaggerDataSourceParams, "swaggerUrl"> = {
        swaggerUrl: values.swaggerUrl,
      };
      const pickedDataSource: Pick<DataSourceResponse, "swaggerUrl"> = {
        swaggerUrl: dataSource?.swaggerUrl as string,
      };

      if (
        dataSource?.id &&
        areValuesEqual<Pick<SwaggerParams, "swaggerUrl">>(
          pickedValues,
          pickedDataSource
        )
      ) {
        nextStep();
        return;
      }

      startLoading({
        id: "creating",
        title: "Creating Data Source",
        message:
          "Wait while we generate your API endpoints from your API specification",
      });

      setIsLoading && setIsLoading(true);

      form.validate();

      const result = await createDataSource(projectId, "API", values);

      if (!result) {
        throw new Error("Failed to create data source");
      }

      setDataSource(result);
      setEndpoints(result.changedEndpoints || []);

      nextStep();

      stopLoading({
        id: "creating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });

      setIsLoading && setIsLoading(false);
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
          rightSection={isLoading && <Loader size="xs" />}
          disabled={isLoading}
        />
        <Divider></Divider>
        <Group position="right">
          <Flex gap="lg" align="end">
            {!isLoading && (
              <Anchor onClick={nextStep}>Continue without Swagger</Anchor>
            )}
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
