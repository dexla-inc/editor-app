import { EndpointRequestInputs } from "@/components/EndpointRequestInputs";
import { EndpointSelect } from "@/components/EndpointSelect";
import { ActionButtons } from "@/components/actions/ActionButtons";
import { ActionsForm } from "@/components/actions/ActionsForm";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSources } from "@/hooks/reactQuery/useDataSources";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { APICallAction, Action, EndpointAuthType } from "@/utils/actions";
import { Button, Divider, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SegmentedControlInput } from "../SegmentedControlInput";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

type FormValues = Omit<APICallAction, "name" | "datasource">;

type Props = {
  id: string;
};

export const APICallActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<APICallAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const router = useRouter();
  const projectId = router.query.id as string;

  const sequentialTo = useEditorStore((state) => state.sequentialTo);

  const { data: dataSources } = useDataSources(projectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );
  const apiAuthConfig = useDataSourceStore((state) => state.apiAuthConfig);

  useEffect(() => {
    if (endpoints?.results) {
      setApiAuthConfig(endpoints.results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoints?.results]);

  const form = useForm<FormValues>({
    initialValues: {
      showLoader: action.action?.showLoader ?? true,
      endpoint: action.action?.endpoint,
      authConfig: action.action?.authConfig,
      binds: {
        header: action.action?.binds?.header ?? {},
        parameter: action.action?.binds?.parameter ?? {},
        body: action.action?.binds?.body ?? {},
      },
      datasources: action.action?.datasources,
      authType: action.action?.authType ?? "authenticated",
    },
  });

  console.log(form.values);

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      updateActionInTree<APICallAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          endpoint: values.endpoint,
          authConfig: apiAuthConfig!,
          showLoader: values.showLoader,
          datasources: dataSources!.results,
          binds: values.binds,
          authType: values.authType,
        },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  // For EmptyDatasourcesPlaceholder
  const removeAction = () => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== id && a.sequentialTo !== id;
      }),
    );
  };

  const selectedEndpoint = endpoints?.results?.find(
    (e) => e.id === form.values.endpoint,
  );

  return endpoints && endpoints.results.length > 0 ? (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
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
          <ActionButtons
            actionId={id}
            componentActions={componentActions}
            canAddSequential={true}
          />
        </Stack>
      </form>
      {sequentialTo === id && (
        <>
          <Divider my="lg" label="Sequential Action" labelPosition="center" />
          <ActionsForm sequentialTo={sequentialTo} />
        </>
      )}
    </>
  ) : (
    <Stack>
      <EmptyDatasourcesPlaceholder projectId={projectId} />
      <Button size="xs" type="button" variant="default" onClick={removeAction}>
        Remove
      </Button>
    </Stack>
  );
};
