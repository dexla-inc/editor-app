import { AuthenticationApiKeyParams } from "@/components/datasources/AuthenticationInputs";
import { DataSourceStepperProps } from "@/utils/dashboardTypes";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

interface AuthenticationStepProps extends DataSourceStepperProps {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export default function ApiKeyAuthentication({
  prevStep,
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  dataSource,
  accessToken,
  setAccessToken,
}: AuthenticationStepProps) {
  const router = useRouter();
  const projectId = router.query.id as string;

  const form = useForm<AuthenticationApiKeyParams>({
    validateInputOnBlur: true,
    initialValues: {
      accessToken: undefined,
    },
  });

  const onSubmit = async (values: AuthenticationApiKeyParams) => {
    try {
      form.validate();

      if (Object.keys(form.errors).length > 0) {
        console.log("Errors: " + form.errors);
        return;
      }

      if (!dataSource?.id) {
        throw new Error("Can't find data source");
      }

      startLoading({
        id: "updating",
        title: "Updating Data Source",
        message: "Wait while your data source is being saved",
      });

      setIsLoading && setIsLoading(true);

      nextStep();

      stopLoading({
        id: "updating",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
      setIsLoading && setIsLoading(false);
    } catch (error: any) {
      console.log(error);
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
          description="The key used to authenticate with the API"
          placeholder="aa982f3c39b17eff97df7d02cf8724126aa6d44fef80268ce307e3492e8ec591d0212978264b74f4755eea0985ddd1d4"
          value={accessToken ?? ""}
          onChange={(e) => setAccessToken(e.target.value)}
        />
      </Stack>
    </form>
  );
}
