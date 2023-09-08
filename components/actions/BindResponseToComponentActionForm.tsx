import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { useEditorStore } from "@/stores/editor";
import { Action, BindResponseToComponentAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { flattenKeysWithRoot } from "@/utils/flattenKeys";
import { ActionIcon, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  id: string;
};

type FormValues = Omit<BindResponseToComponentAction, "name">;

export const BindResponseToComponentActionForm = ({ id }: Props) => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } =
    useActionData<BindResponseToComponentAction>({
      actionId: id,
      editorTree,
      selectedComponentId,
    });
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo
  );
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo
  );

  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const projectId = router.query.id as string;
  const component = getComponentById(editorTree.root, selectedComponentId!);

  const originalAction = componentActions.find(
    (a: Action) => a.id === action.sequentialTo
  );

  const form = useForm<FormValues>({
    initialValues: {
      binds: action.action.binds ?? [],
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
          updateTreeComponent(bind.component!, {
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
      })
    );

    updateTreeComponent(selectedComponentId!, {
      data: undefined,
      exampleData: undefined,
    });

    form.values
      .binds!.filter((b) => !!b.component)
      .forEach((bind) => {
        updateTreeComponent(bind.component!, {
          data: undefined,
          exampleData: undefined,
        });
      });
  };

  useEffect(() => {
    if (componentToBind && pickingComponentToBindTo) {
      if (pickingComponentToBindTo.componentId === component?.id) {
        form.setFieldValue(`binds.${pickingComponentToBindTo.index ?? 0}`, {
          ...(form.values.binds![pickingComponentToBindTo.index ?? 0] ?? {}),
          component: componentToBind,
          value: pickingComponentToBindTo.param,
        });

        setPickingComponentToBindTo(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component?.id, componentToBind, pickingComponentToBindTo]);

  useEffect(() => {
    const getEndpoint = async () => {
      const { results } = await getDataSourceEndpoints(
        projectId,
        // @ts-ignore
        originalAction?.action.datasource.id
      );

      const _endpoint = results.find(
        // @ts-ignore
        (e) => e.id === originalAction?.action.endpoint
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
      originalAction?.action?.datasource?.id &&
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
          return (
            <TextInput
              key={bind.value}
              size="xs"
              label="Component to bind"
              description={`Binding to ${bind.value}`}
              {...form.getInputProps(`binds.${index}.component`)}
              rightSection={
                <ActionIcon
                  onClick={() => {
                    setPickingComponentToBindTo({
                      componentId: component?.id!,
                      trigger: action.trigger,
                      bindedId: action.action.binds?.[index]?.component ?? "",
                      param: bind.value,
                      index: index,
                    });
                  }}
                >
                  <IconCurrentLocation size={ICON_SIZE} />
                </ActionIcon>
              }
            />
          );
        })}
        <ActionButtons
          actionId={id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
          optionalRemoveAction={removeAction}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
