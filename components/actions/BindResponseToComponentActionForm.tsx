import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { Action, BindResponseToComponentAction } from "@/utils/actions";
import { getComponentById } from "@/utils/editor";
import { flattenKeysWithRoot } from "@/utils/flattenKeys";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  id: string;
};

type FormValues = Omit<BindResponseToComponentAction, "name">;

export const BindResponseToComponentActionForm = ({ id }: Props) => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } =
    useActionData<BindResponseToComponentAction>({
      actionId: id,
      editorTree,
      selectedComponentId,
    });
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );

  const projectId = router.query.id as string;
  const component = getComponentById(editorTree.root, selectedComponentId!);

  const originalAction = componentActions.find(
    (a: Action) => a.id === action.sequentialTo,
  );

  const form = useForm<FormValues>({
    initialValues: {
      binds: action.action?.binds ?? [],
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<BindResponseToComponentAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { binds: values.binds },
        updateTreeComponentActions,
      });

      values
        .binds!.filter((b) => !!b.component)
        .forEach((bind) => {
          updateTreeComponent({
            componentId: bind.component!,
            props: {
              dataPath: bind.value.startsWith("root[0].")
                ? bind.value.split("root[0].")[1]
                : bind.value.split("root.")[1],
              exampleData: { value: bind.example },
              headers: Array.isArray(bind.example)
                ? Object.keys(bind.example[0]).reduce((acc, key) => {
                    return {
                      ...acc,
                      [key]: typeof key === "string",
                    };
                  }, {})
                : {},
            },
          });
        });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const removeAction = () => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== id && a.sequentialTo !== id;
      }),
    );

    updateTreeComponent({
      componentId: selectedComponentId!,
      props: {
        data: undefined,
        exampleData: undefined,
      },
    });

    form.values
      .binds!.filter((b) => !!b.component)
      .forEach((bind) => {
        updateTreeComponent({
          componentId: bind.component!,
          props: {
            data: undefined,
            exampleData: undefined,
          },
        });
      });
  };

  useEffect(() => {
    const getEndpoint = async () => {
      const { results } = await getDataSourceEndpoints(projectId);

      const _endpoint = results.find(
        // @ts-ignore
        (e) => e.id === originalAction?.action.endpoint,
      );

      if (_endpoint?.exampleResponse) {
        const json = JSON.parse(_endpoint?.exampleResponse as string);
        const binds = flattenKeysWithRoot(json);

        Object.keys(binds).forEach((bind) => {
          form.insertListItem("binds", {
            component: "",
            value: bind,
            example: bind.endsWith("[0]") ? json : json[bind] || "--",
          });
        });
      }
    };

    if (
      // @ts-ignore
      form.values.binds?.length === 0
    ) {
      getEndpoint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalAction, projectId, form]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        {form.values.binds?.map((bind, index) => {
          const field = `binds.${index}`;
          return (
            <ComponentToBindFromInput
              key={bind.value}
              componentId={component?.id!}
              onPickComponent={(componentToBind: string) => {
                form.setFieldValue(`binds.${index}`, {
                  ...form.getInputProps("bind"),
                  component: componentToBind,
                  value: bind,
                });
                setComponentToBind(undefined);
              }}
              onPickVariable={(variable: string) => {
                form.setFieldValue(`binds.${index}`, {
                  ...form.getInputProps("bind"),
                  component: variable,
                  value: bind,
                });
              }}
              size="xs"
              label="Component to bind"
              description={`Binding to ${bind.value}`}
              {...form.getInputProps(bind.component)}
              // @ts-ignore
              value={bind}
              onChange={(e) => {
                form.setFieldValue(field, e.currentTarget.value);
              }}
            />
          );
        })}
        <ActionButtons
          actionId={id}
          componentActions={componentActions}
          optionalRemoveAction={removeAction}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
