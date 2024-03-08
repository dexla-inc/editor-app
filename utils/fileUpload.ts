import { useEditorTreeStore } from "@/stores/editorTree";
import { Component } from "@/utils/editor";

export const saveFile = (component: Component, files: any) => {
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;
  updateTreeComponentAttrs({
    componentIds: [component.id!],
    attrs: {
      props: {
        files: [...(component.props?.files ?? []), files],
      },
    },
  });
};
