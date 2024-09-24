import { InformationAlert } from "@/components/Alerts";
import {
  SwaggerURLInput,
  validateSwaggerUrl,
} from "@/components/datasources/SwaggerURLInput";
import NextButton from "@/components/NextButton";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { createDataSource } from "@/requests/datasources/mutations";
import { DataSourceParams } from "@/requests/datasources/types";
import {
  areValuesEqual,
  DataSourceStepperWithoutPreviousProps,
} from "@/types/dashboardTypes";
import {
  Anchor,
  Divider,
  Flex,
  Group,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Image from "next/image";

export default function SwaggerStep({
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  dataSource,
  setDataSource,
}: DataSourceStepperWithoutPreviousProps) {
  const { id: projectId } = useEditorParams();
  const theme = useMantineTheme();

  const form = useForm<DataSourceParams>({
    initialValues: {
      swaggerUrl: dataSource?.swaggerUrl || "",
      type: "SWAGGER",
    },
    validate: {
      swaggerUrl: (value) => validateSwaggerUrl(value),
    },
  });

  const persistDatasource = async (values: DataSourceParams) => {
    startLoading({
      id: "creating",
      title: "Creating Data Source",
      message:
        "Wait while we generate your API endpoints from your API specification",
    });

    setIsLoading && setIsLoading(true);

    const result = await createDataSource(projectId, values);

    if (!result) {
      throw new Error("Failed to create data source");
    }

    setDataSource && setDataSource(result);

    nextStep();

    stopLoading({
      id: "creating",
      title: "Data Source Saved",
      message: "The data source was saved successfully",
    });

    setIsLoading && setIsLoading(false);
  };

  const onSubmit = async (values: DataSourceParams) => {
    try {
      if (
        dataSource?.id &&
        areValuesEqual<DataSourceParams>(values, dataSource)
      ) {
        nextStep();
        return;
      }

      form.validate();

      await persistDatasource(values);
    } catch (error: any) {
      stopLoading({
        id: "creating",
        title: "Error",
        message: error,
        isError: true,
      });
      setIsLoading && setIsLoading(false);
    }
  };

  const skipValidationAndProceed = async () => {
    try {
      await persistDatasource(form.values);
    } catch (error: any) {
      stopLoading({
        id: "creating",
        title: "Error",
        message: error,
        isError: true,
      });
      setIsLoading && setIsLoading(false);
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
        <Divider />

        <Flex align="center" gap="md" justify="space-between">
          <Image
            src={`/swagger_logo${
              theme.colorScheme === "dark" ? "_white" : ""
            }.svg`}
            alt="Swagger Logo"
            width={200}
            height={80}
          />
          <Group position="right">
            <Flex gap="lg" align="end">
              {!isLoading && (
                <Anchor onClick={skipValidationAndProceed}>
                  Continue without Swagger
                </Anchor>
              )}
              <NextButton
                isLoading={isLoading}
                disabled={isLoading}
                isSubmit={true}
              ></NextButton>
            </Flex>
          </Group>
        </Flex>
      </Stack>
    </form>
  );
}
