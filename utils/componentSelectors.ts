import { EditorTreeState } from "@/stores/editorTree";

export const selectedComponentIdSelector = (state: EditorTreeState) =>
  state.selectedComponentIds?.at(-1)?.split("-repeated-")[0];

export const selectedComponentIdsSelector = (state: EditorTreeState) =>
  state.selectedComponentIds?.map((id) => id.split("-repeated-")[0]) ?? [];

export const isSelectedSelector = (id: string) => (state: EditorTreeState) =>
  state.selectedComponentIds?.some(
    (selectedComponentId) => selectedComponentId.split("-repeated-")[0] === id,
  );
