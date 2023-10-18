import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useRequestProp } from "@/hooks/useRequestProp";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { BindResponseToComponentAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
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

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setTree = useEditorStore((state) => state.setTree);

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
            onPickComponent={(componentToBind: string) => {
              form.setFieldValue(`binds.${index}`, {
                ...form.getInputProps("bind"),
                component: componentToBind,
                value: bind,
              });
              setComponentToBind(undefined);
              setPickingComponentToBindTo(undefined);
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

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
