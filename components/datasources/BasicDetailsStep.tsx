import BackButton from "@/components/BackButton";
import {
  BasicDetailsInputs,
  validateBaseUrl,
  validateName,
} from "@/components/datasources/BasicDetailsInputs";
import NextButton from "@/components/NextButton";
import { updateDataSource } from "@/requests/datasources/mutations";
import {
  AuthenticationSchemes,
  DataSourceParams,
  DataSourceResponse,
} from "@/requests/datasources/types";
import {
  areValuesEqual,
  LoadingStore,
  NextStepperClickEvent,
  PreviousStepperClickEvent,
} from "@/types/dashboardTypes";
import { Divider, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

export interface BasicDetailsStepProps
  extends LoadingStore,
    NextStepperClickEvent,
    PreviousStepperClickEvent {
  dataSource: DataSourceResponse;
  setDataSource: (dataSource: DataSourceResponse) => void;
  authenticationScheme?: AuthenticationSchemes | null;
  setAuthenticationScheme: (
    authenticationScheme: AuthenticationSchemes | null,
  ) => void;
}

export default function BasicDetailsStep({
  prevStep,
  nextStep,
  isLoading,
  startLoading,
  stopLoading,
  dataSource,
  setDataSource,
  authenticationScheme,
  setAuthenticationScheme,
}: BasicDetailsStepProps) {
  const router = useRouter();
  const projectId = router.query.id as string;
  if (dataSource?.authenticationScheme) {
    setAuthenticationScheme(dataSource?.authenticationScheme);
  }

  const form = useForm<DataSourceParams>({
    initialValues: {
      name: dataSource?.name || "",
      baseUrl: dataSource?.baseUrl || "",
      environment: dataSource?.environment || "",
      authenticationScheme: dataSource?.authenticationScheme || "NONE",
      type: "API",
    },
    validate: {
      baseUrl: (value) => validateBaseUrl(value),
      name: (value) => validateName(value),
    },
  });

  function handleNextStep(authScheme: AuthenticationSchemes | undefined) {
    if (authScheme === "NONE") {
      nextStep();
      nextStep();
    } else {
      nextStep();
    }
  }

  const onSubmit = async (values: DataSourceParams) => {
    try {
      if (areValuesEqual<DataSourceParams>(values, dataSource)) {
        handleNextStep(values.authenticationScheme);
        return;
      }

      startLoading({
        id: "creating",
        title: "Updating Data Source",
        message: "Wait while your data source is being saved",
      });

      form.validate();

      if (!dataSource?.id) {
        throw new Error("Can't find data source");
      }

      await updateDataSource(projectId, dataSource.id, false, values);

      const result: DataSourceResponse = {
        ...dataSource,
        ...values,
      };

      setDataSource(result);

      handleNextStep(values.authenticationScheme);

      stopLoading({
        id: "creating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
    } catch (error: any) {
      stopLoading({
        id: "creating",
        title: "Data Source Failed",
        message: error,
        isError: true,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <BasicDetailsInputs
          form={form}
          authenticationScheme={authenticationScheme}
          setAuthenticationScheme={setAuthenticationScheme}
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
