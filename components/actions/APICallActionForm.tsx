import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { EndpointSelect } from "@/components/EndpointSelect";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { APICallAction, EndpointAuthType } from "@/utils/actions";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SegmentedControlInput } from "../SegmentedControlInput";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

type Props = {
  form: UseFormReturnType<Omit<APICallAction, "name" | "datasource">>;
};

export const APICallActionForm = ({ form }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;

  const sequentialTo = useEditorStore((state) => state.sequentialTo);

  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );

  useEffect(() => {
    if (endpoints?.results) {
      setApiAuthConfig(endpoints.results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoints?.results]);

  // For EmptyDatasourcesPlaceholder
  // const removeAction = () => {
  //   updateTreeComponentActions(
  //     selectedComponentId!,
  //     componentActions.filter((a: Action) => {
  //       return a.id !== id && a.sequentialTo !== id;
  //     }),
  //   );
  // };

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
            />
          </>
        )}
      </Stack>
      {/*{sequentialTo === id && (*/}
      {/*  <>*/}
      {/*    <Divider my="lg" label="Sequential Action" labelPosition="center" />*/}
      {/*    <ActionsForm sequentialTo={sequentialTo} />*/}
      {/*  </>*/}
      {/*)}*/}
    </>
  ) : (
    <Stack>
      <EmptyDatasourcesPlaceholder projectId={projectId} />
      {/*<Button size="xs" type="button" variant="default" onClick={removeAction}>*/}
      <Button size="xs" type="button" variant="default">
        Remove
      </Button>
    </Stack>
  );
};
