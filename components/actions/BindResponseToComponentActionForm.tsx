import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { Endpoint } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, BindResponseToComponentAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Popover, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  id: string;
};

type ComponentBind = { component: string; value: string };
type FormValues = {
  binds: ComponentBind[];
};

export const BindResponseToComponentActionForm = ({ id }: Props) => {
  const router = useRouter();
  const [endpoint, setEndpoint] = useState<Endpoint | undefined>(undefined);
  const [ReactJson, setReactJson] = useState();
  const [showJsonPicker, jsonPicker] = useDisclosure(false);
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

  const projectId = router.query.id as string;
  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.props?.actions ?? [];
  const action: Action = componentActions.find((a: Action) => a.id === id);
  const bindResponseToComponent =
    action.action as BindResponseToComponentAction;

  const originalAction = componentActions.find(
    (a: Action) => a.id === action.sequentialTo
  );

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

      updateTreeComponent(selectedComponentId!, {
        actions: componentActions.map((action: Action) => {
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
        }),
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

  const removeAction = () => {
    updateTreeComponent(selectedComponentId!, {
      actions: componentActions.filter((a: Action) => {
        return a.id !== action.id;
      }),
    });
  };

  useEffect(() => {
    if (componentToBind && pickingComponentToBindTo) {
      if (pickingComponentToBindTo.componentId === component?.id) {
        form.setFieldValue(`binds.${pickingComponentToBindTo.index ?? 0}`, {
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
        originalAction.action.datasource.id
      );

      const _endpoint = results.find(
        (e) => e.id === originalAction.action.endpoint
      );
      setEndpoint(_endpoint);
    };

    if (originalAction?.action?.datasource?.id) {
      getEndpoint();
    }
  }, [action, originalAction, projectId]);

  useEffect(() => {
    // we need to dynamicaly import it as it doesn't support SSR
    const loadJsonViewer = async () => {
      const ReactJsonView = await import("react-json-view");
      setReactJson(ReactJsonView as any);
    };

    loadJsonViewer();
  }, []);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        {endpoint?.exampleResponse && (
          <Popover
            position="left"
            withArrow
            shadow="md"
            withinPortal
            opened={showJsonPicker}
            onChange={(isOpen) => {
              if (isOpen) {
                jsonPicker.open();
              } else {
                jsonPicker.close();
              }
            }}
            radius="md"
          >
            <Popover.Target>
              <Button onClick={jsonPicker.open} size="xs" variant="default">
                Add new binding
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              {ReactJson && (
                // @ts-ignore
                <ReactJson.default
                  iconStyle="triangle"
                  enableClipboard={false}
                  displayDataTypes={false}
                  quotesOnKeys={false}
                  collapseStringsAfterLength={10}
                  src={JSON.parse(endpoint?.exampleResponse as string)}
                  onSelect={(selected: any) => {
                    form.insertListItem("binds", {
                      component: "",
                      value: selected.name,
                    });
                    jsonPicker.close();
                  }}
                />
              )}
            </Popover.Dropdown>
          </Popover>
        )}
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
