import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useRequestProp } from "@/hooks/useRequestProp";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { BindResponseToComponentAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { getComponentById } from "@/utils/editor";
import { flattenKeysWithRoot } from "@/utils/flattenKeys";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<BindResponseToComponentAction, "name">;

export const BindResponseToComponentFlowActionForm = ({ form }: Props) => {
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

  const component = getComponentById(editorTree.root, selectedComponentId!);

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
        (e) => e.id === form.values.endpoint,
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
  }, [projectId, form]);

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
    <Stack spacing="xs">
      {form.values.binds?.map((bind, index) => {
        const field = `binds.${index}`;
        return (
          <ComponentToBindFromInput
            key={bind.value}
            onPick={(componentToBind: string) => {
              form.setFieldValue(`binds.${index}`, {
                ...form.getInputProps("bind"),
                component: componentToBind,
                value: bind,
              });
              setComponentToBind(undefined);
            }}
            size="xs"
            label="Component to bind"
            description={`Binding to ${bind.value}`}
            {...form.getInputProps(bind.component)}
            // @ts-ignore
            value={bind}
            onChange={(e) => {
              form.setValues({
                ...form.values,
                [field]: e.currentTarget.value,
              });
            }}
          />
        );
      })}

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
