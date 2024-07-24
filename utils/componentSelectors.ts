import { EditorTreeState } from "@/stores/editorTree";

export const selectedComponentIdSelector = (state: EditorTreeState) =>
  state.selectedComponentIds?.at(-1)?.split("-related-")[0];

export const selectedComponentIdsSelector = (state: EditorTreeState) =>
  state.selectedComponentIds?.map((id) => id.split("-related-")[0]) ?? [];

export const isSelectedSelector = (id: string) => (state: EditorTreeState) =>
  state.selectedComponentIds?.some(
    (selectedComponentId) => selectedComponentId.split("-related-")[0] === id,
  );

export const isEditorModeSelector = (state: EditorTreeState) =>
  !state.isPreviewMode && !state.isLive;

export const isPreviewModeSelector = (state: EditorTreeState) =>
  state.isPreviewMode || state.isLive;
