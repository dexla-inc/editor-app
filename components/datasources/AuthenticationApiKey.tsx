import BackButton from "@/components/BackButton";
import NextButton from "@/components/NextButton";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { updateDataSource } from "@/requests/datasources/mutations";
import { DataSourceParams } from "@/requests/datasources/types";
import { DataSourceStepperProps } from "@/types/dashboardTypes";
import { Divider, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface AuthenticationStepProps extends DataSourceStepperProps {
  setAccessToken: (accessToken: string | null) => void;
}

export default function AuthenticationApiKey({
  prevStep,
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  dataSource,
  setAccessToken,
}: AuthenticationStepProps) {
  const { id: projectId } = useEditorParams();

  const form = useForm<DataSourceParams>({
    validateInputOnBlur: true,
    initialValues: {
      authValue: undefined,
      type: "API",
    },
    validate: {
      authValue: (value) =>
        value === "" ? "You must provide an API key" : null,
    },
  });

  const onSubmit = async (values: DataSourceParams) => {
    try {
      if (Object.keys(form.errors).length > 0) {
        console.error("Errors: " + form.errors);
        return;
      }

      if (!dataSource?.id) {
        throw new Error("Can't find data source");
      }

      form.validate();

      startLoading({
        id: "updating",
        title: "Updating Data Source",
        message: "Wait while your data source is being saved",
      });

      setIsLoading && setIsLoading(true);

      const mergedDataSource = { ...dataSource, ...values };

      await updateDataSource(projectId, dataSource.id, false, mergedDataSource);

      nextStep && nextStep();

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
      setIsLoading && setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      stopLoading({
        id: "updating",
        title: "Data Source Failed",
        message: error,
        isError: true,
      });
      setIsLoading && setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack pb={100}>
        <TextInput
          label="API Key"
          description="The key used to authenticate to the API"
          placeholder="aa982f3c39b17...."
          {...form.getInputProps("authValue")}
          onChange={(e) => {
            form.setFieldValue("authValue", e.target.value);
            setAccessToken(e.target.value);
          }}
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
