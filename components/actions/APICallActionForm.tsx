import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { EndpointSelect } from "@/components/EndpointSelect";
import { useDataSourceEndpoints } from "@/hooks/editor/reactQuery/useDataSourceEndpoints";
import {
  ActionFormProps,
  APICallAction,
  EndpointAuthType,
} from "@/utils/actions";
import { Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { SegmentedControlInput } from "../SegmentedControlInput";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

type Props = ActionFormProps<Omit<APICallAction, "name" | "datasource">>;

export const APICallActionForm = ({ form, isPageAction }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;

  const { data: endpoints } = useDataSourceEndpoints(projectId);

  const selectedEndpoint = endpoints?.results?.find(
    (e) => e.id === form.values.endpoint,
  );

  return endpoints && endpoints.results.length > 0 ? (
    <>
      <Stack spacing="xs">
        <EndpointSelect {...form.getInputProps("endpoint")} />
        {selectedEndpoint && (
          <>
            <SegmentedControlInput
              label="Auth Type"
              data={[
                {
                  label: "Default",
                  value: "authenticated",
                },
                {
                  label: "Login",
                  value: "login",
                },
                {
                  label: "Logout",
                  value: "logout",
                },
              ]}
              {...form.getInputProps("authType")}
              onChange={(value) => {
                form.setFieldValue("authType", value as EndpointAuthType);
              }}
            />
            <SegmentedControlYesNo
              label="Show Loader"
              {...form.getInputProps("showLoader")}
              onChange={(value) => {
                form.setFieldValue("showLoader", value);
              }}
            />
            <EndpointRequestInputs
              selectedEndpoint={selectedEndpoint}
              form={form}
              isPageAction={isPageAction}
            />
          </>
        )}
      </Stack>
    </>
  ) : (
    <EmptyDatasourcesPlaceholder projectId={projectId} />
  );
};
