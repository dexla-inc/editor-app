import { useEditorStore } from "@/stores/editor";
import {
  Component,
  debouncedTreeComponentAttrsUpdate,
  getComponentById,
} from "@/utils/editor";
import get from "lodash.get";
import { PagingResponse } from "@/requests/types";
import { Endpoint } from "@/requests/datasources/types";
import { useForm } from "@mantine/form";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

type Props = {
  component: Component;
  endpoints: PagingResponse<Endpoint>;
  children: (props: any) => JSX.Element;
  customKeys: string[];
};

export const DynamicChildSettings = ({
  component,
  endpoints,
  children,
  customKeys,
}: Props) => {
  const editorTree = useEditorStore((state) => state.tree);
  const form = useForm({
    initialValues: {
      ...pick(component.onLoad ?? {}, customKeys),
    },
  });

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({
        onLoad: form.values,
      });
    }
  }, [form.values]);

  const parentDataComponent = getComponentById(
    editorTree.root,
    component.parentDataComponentId,
  );
  const parentEndpoint = endpoints?.results?.find(
    (e) => e.id === parentDataComponent?.onLoad?.endpointId,
  );

  const selectableObject = parentDataComponent?.onLoad?.resultsKey
    ? get(
        JSON.parse(parentEndpoint?.exampleResponse || "{}"),
        parentDataComponent?.onLoad?.resultsKey,
      )
    : JSON.parse(parentEndpoint?.exampleResponse || "{}");

  const selectableObjectKeys = Object.keys(
    Array.isArray(selectableObject) ? selectableObject[0] : selectableObject,
  );

  return children({ form, selectableObjectKeys });
};
