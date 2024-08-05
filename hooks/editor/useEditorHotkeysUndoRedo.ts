import { useHotkeysOnIframe } from "@/hooks/editor/useHotkeysOnIframe";
import { useHotkeys } from "@mantine/hooks";
import { useUndoRedo } from "./useUndoRedo";
import { useHandlePageStateUndoRedo } from "@/hooks/editor/useHandlePageStateUndoRedo";
import { useEditorTreeStore } from "@/stores/editorTree";

export default function useEditorHotkeysUndoRedo() {
  const { undo, redo } = useUndoRedo();

  useHotkeys([
    [
      "mod+Z",
      () => {
        const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
        if (!isPreviewMode) undo();
      },
    ],
    [
      "mod+shift+Z",
      () => {
        const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
        if (!isPreviewMode) redo();
      },
    ],
    [
      "mod+Y",
      () => {
        const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
        if (!isPreviewMode) redo();
      },
    ],
  ]);

  useHotkeysOnIframe([
    [
      "mod+Z",
      () => {
        const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
        if (!isPreviewMode) undo();
      },
    ],
    [
      "mod+shift+Z",
      () => {
        const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
        if (!isPreviewMode) redo();
      },
    ],
    [
      "mod+Y",
      () => {
        const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
        if (!isPreviewMode) redo();
      },
    ],
  ]);

  useHandlePageStateUndoRedo();
}
