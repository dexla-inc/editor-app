import { useComputeValue } from "@/hooks/data/useComputeValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Component, getComponentTreeById } from "@/utils/editor";
import { SelectItem } from "@mantine/core";

export function useGetComponentOptions(id?: string) {
  const treeRoot = useEditorTreeStore((state) => state.tree.root);
  const component = getComponentTreeById(treeRoot, id!);

  const onLoad = useComputeValue({
    onLoad: (component as Component)?.onLoad ?? {},
  });

  const dataHandler: Record<string, any[]> = {
    Select: onLoad.data ?? (component as Component)?.props?.data,
    Radio:
      component?.children?.map((child) => {
        const value =
          (child as Component)?.onLoad?.value ??
          (child as Component)?.props?.value;
        return {
          value,
          label: value,
        };
      }) ?? [],
    default: [],
  };
  const name = component?.name ?? "default";
  const data = useComputeValue({ onLoad: dataHandler[name] }) as SelectItem[];
  return { name, data };
}
