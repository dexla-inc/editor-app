import * as FlexStructure from "@/libs/dnd-flex/components/mapper/structure/Text";
import * as GridStructure from "@/libs/dnd-grid/components/mapper/structure/Text";
import { useEditorTreeStore } from "@/stores/editorTree";

export const jsonStructure = (props: any) => {
  const cssType = useEditorTreeStore.getState().cssType;
  return cssType === "FLEX"
    ? FlexStructure.jsonStructure(props)
    : GridStructure.jsonStructure(props);
};
