import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, BindResponseToComponentAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { flattenKeysWithRoot } from "@/utils/flattenKeys";
import { ActionIcon, Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  id: string;
};

type ComponentBind = { component: string; value: string; example: string };
type FormValues = {
  binds: ComponentBind[];
};

export const BindResponseToComponentActionForm = ({ id }: Props) => {
  const router = useRouter();
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo
  );
  const editorTree = useEditorStore((state) => state.tree);
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions
  );

  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);

  const projectId = router.query.id as string;
  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.actions ?? [];
  const action: Action = componentActions.find(
    (a: Action) => a.id === id
  ) as Action;

  const filteredComponentActions = componentActions.filter((a: Action) => {
    return a.id === action.id || a.sequentialTo === action.id;
  });

  const bindResponseToComponent =
    action.action as BindResponseToComponentAction;

  const originalAction = componentActions.find(
    (a: Action) => a.id === action.sequentialTo
  );

  const [copied, { open, close }] = useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues: {
      binds: bindResponseToComponent.binds ?? [],
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      startLoading({
        id: "saving-action",
        title: "Saving Action",
        message: "Wait while we save your changes",
      });

      updateTreeComponentActions(
        selectedComponentId!,
        componentActions.map((action: Action) => {
          if (action.id === id) {
            return {
              ...action,
              action: {
                ...action.action,
                binds: values.binds,
              },
            };
          }

          return action;
        })
      );

      values.binds
        .filter((b) => !!b.component)
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

      stopLoading({
        id: "saving-action",
        title: "Action Saved",
        message: "Your changes were saved successfully",
      });
    } catch (error) {
      stopLoading({
        id: "saving-action",
        title: "Failed",
        message: "Oops, something went wrong while saving your changes",
        isError: true,
      });
    }
  };

  const copyAction = () => {
    setCopiedAction(filteredComponentActions);
    open();
  };

  useEffect(() => {
    const timeout = setTimeout(() => copied && close(), 2000);
    return () => clearTimeout(timeout);
  });

  const removeAction = () => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== action.id && a.sequentialTo !== action.id;
      })
    );

    updateTreeComponent(selectedComponentId!, {
      data: undefined,
      exampleData: undefined,
    });

    form.values.binds
      .filter((b) => !!b.component)
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
          ...(form.values.binds[pickingComponentToBindTo.index ?? 0] ?? {}),
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
      form.values.binds.length === 0
    ) {
      getEndpoint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalAction, projectId, form]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        {form.values.binds.map((bind, index) => {
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
                      bindedId:
                        bindResponseToComponent?.binds?.[index]?.component ??
                        "",
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

        <Button size="xs" type="submit" mt="xs">
          Save
        </Button>
        <Button
          size="xs"
          type="button"
          variant="light"
          color="pink"
          onClick={copyAction}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          size="xs"
          type="button"
          variant="default"
          onClick={removeAction}
          color="red"
        >
          Remove
        </Button>
      </Stack>
    </form>
  );
};
