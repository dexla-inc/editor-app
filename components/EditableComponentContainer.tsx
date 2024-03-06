// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { EditableComponent } from "@/components/EditableComponent";
import { ComponentTree } from "@/utils/editor";
import { ReactNode } from "react";

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
  console.log("EditableComponentContainer");
  // const isSelected = useEditorStore(
  //   (state) => state.selectedComponentIds?.includes(componentTree.id!),
  // );

  // const selectedByOther = useEditorStore((state) => {
  //   const other = state.liveblocks?.others?.find(({ presence }: any) => {
  //     return presence.selectedComponentIds?.includes(componentTree.id);
  //   });

  //   if (!other) return null;

  //   return CURSOR_COLORS[other.connectionId % CURSOR_COLORS.length];
  // });

  return (
    <EditableComponent
      id={componentTree.id!}
      component={componentTree}
      //isSelected={isSelected}
      //selectedByOther={selectedByOther ?? undefined}
      shareableContent={shareableContent}
    >
      {children}
    </EditableComponent>
  );
};
