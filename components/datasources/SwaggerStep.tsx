import { InformationAlert } from "@/components/Alerts";
import {
  SwaggerURLInput,
  validateSwaggerUrl,
} from "@/components/datasources/SwaggerURLInput";
import NextButton from "@/components/NextButton";
import { createDataSource } from "@/requests/datasources/mutations";
import { DataSourceParams, Endpoint } from "@/requests/datasources/types";
import {
  areValuesEqual,
  DataSourceStepperWithoutPreviousProps,
} from "@/utils/dashboardTypes";
import { Anchor, Divider, Flex, Group, Stack } from "@mantine/core";
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

  const form = useForm<DataSourceParams>({
    initialValues: {
      swaggerUrl: dataSource?.swaggerUrl || "",
    },
    validate: {
      swaggerUrl: (value) => validateSwaggerUrl(value),
    },
  });

  const onSubmit = async (values: DataSourceParams) => {
    try {
      if (
        dataSource?.id &&
        areValuesEqual<DataSourceParams>(values, dataSource)
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

        <SwaggerURLInput isLoading={isLoading} form={form} />
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
