// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { EditableComponent } from "@/components/EditableComponent";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { CURSOR_COLORS } from "@/utils/config";
import { ComponentTree } from "@/utils/editor";
import { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

type EditableComponentContainerProps = {
  children: ReactNode;
  componentTree: ComponentTree;
  shareableContent: any;
};

export const EditableComponentContainer = ({
  children,
  componentTree,
  shareableContent,
}: EditableComponentContainerProps) => {
  const isSelected = useEditorTreeStore(
    (state) => state.selectedComponentIds?.includes(componentTree.id!),
  );

  const selectedByOther = useEditorTreeStore(
    useShallow((state) => {
      const other = state.liveblocks?.others?.find(({ presence }: any) => {
        return presence.selectedComponentIds?.includes(componentTree.id);
      });

      if (!other) return null;

      return CURSOR_COLORS[other.connectionId % CURSOR_COLORS.length];
    }),
  );

  return (
    <EditableComponent
      id={componentTree.id!}
      component={componentTree}
      isSelected={isSelected}
      selectedByOther={selectedByOther ?? undefined}
      shareableContent={shareableContent}
    >
      {children}
    </EditableComponent>
  );
};
