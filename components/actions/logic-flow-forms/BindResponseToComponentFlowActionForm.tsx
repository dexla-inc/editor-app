import { useActionData } from "@/components/actions/_BaseActionFunctions";
import { useRequestProp } from "@/hooks/useRequestProp";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { Action, BindResponseToComponentAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { flattenKeysWithRoot } from "@/utils/flattenKeys";
import { ActionIcon, Button, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
  id: string;
};

type FormValues = Omit<BindResponseToComponentAction, "name">;

export const BindResponseToComponentActionForm = ({ form, id }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const router = useRouter();
  const projectId = router.query.id as string;

  const {
    tree: editorTree,
    selectedComponentId,
    setTree,
    setComponentToBind,
    pickingComponentToBindTo,
    setPickingComponentToBindTo,
    componentToBind,
  } = useEditorStore();

  const { componentActions, action } =
    useActionData<BindResponseToComponentAction>({
      actionId: id,
      editorTree,
      selectedComponentId,
    });

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const originalAction = componentActions.find(
    (a: Action) => a.id === action.sequentialTo,
  );

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

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
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

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
