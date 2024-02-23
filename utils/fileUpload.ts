import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";

export const saveFile = (component: Component, files: any) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent({
    componentId: component.id!,
    props: {
      files: [...(component.props?.files ?? []), files],
    },
  });
};
