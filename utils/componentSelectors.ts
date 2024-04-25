import { EditorTreeState } from "@/stores/editorTree";

export const selectedComponentIdSelector = (state: EditorTreeState) =>
  state.selectedComponentIds?.at(-1)?.split("-repeated-")[0];
