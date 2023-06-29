import NextButton from "@/components/projects/NextButton";
import { updateDataSource } from "@/requests/datasources/mutations";
import {
  DataSourceParams,
  DataSourceResponse,
} from "@/requests/datasources/types";
import {
  LoadingStore,
  NextStepperClickEvent,
  PreviousStepperClickEvent,
  areValuesEqual,
} from "@/utils/dashboardTypes";
import { Divider, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import BackButton from "../projects/BackButton";
import {
  BasicDetailsInputs,
  validateBaseUrl,
  validateName,
} from "./BasicDetailsInputs";

export interface BasicDetailsStepProps
  extends LoadingStore,
    NextStepperClickEvent,
    PreviousStepperClickEvent {
  dataSource: DataSourceResponse;
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

  const form = useForm<DataSourceParams>({
    initialValues: {
      name: dataSource?.name || "",
      baseUrl: dataSource?.baseUrl || "",
      environment: dataSource?.environment || "",
      authenticationScheme: dataSource?.authenticationScheme || "",
    },
    validate: {
      baseUrl: (value) => validateBaseUrl(value),
      name: (value) => validateName(value),
    },
  });

  const onSubmit = async (values: DataSourceParams) => {
    console.log("authValues:" + JSON.stringify(values));
    try {
      if (areValuesEqual<DataSourceParams>(values, dataSource)) {
        nextStep();
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
        <BasicDetailsInputs form={form} />
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
