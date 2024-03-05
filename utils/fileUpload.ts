import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";

export const saveFile = (component: Component, files: any) => {
  const updateTreeComponentAttrs =
    useEditorStore.getState().updateTreeComponentAttrs;
  updateTreeComponentAttrs({
    componentIds: [component.id!],
    attrs: {
      props: {
        files: [...(component.props?.files ?? []), files],
      },
    },
  });
};
