import { useHotkeysOnIframe } from "@/hooks/editor/useHotkeysOnIframe";
import { useHotkeys } from "@mantine/hooks";
import { useUndoRedo } from "./useUndoRedo";
import { useHandlePageStateUndoRedo } from "@/hooks/editor/useHandlePageStateUndoRedo";

export default function useEditorHotkeysUndoRedo() {
  const { undo, redo, isPreviewMode } = useUndoRedo();

  useHotkeys([
    [
      "mod+Z",
      () => {
        if (!isPreviewMode) undo();
      },
    ],
    [
      "mod+shift+Z",
      () => {
        if (!isPreviewMode) redo();
      },
    ],
    [
      "mod+Y",
      () => {
        if (!isPreviewMode) redo();
      },
    ],
  ]);

  useHotkeysOnIframe([
    [
      "mod+Z",
      () => {
        if (!isPreviewMode) undo();
      },
    ],
    [
      "mod+shift+Z",
      () => {
        if (!isPreviewMode) redo();
      },
    ],
    [
      "mod+Y",
      () => {
        if (!isPreviewMode) redo();
      },
    ],
  ]);

  useHandlePageStateUndoRedo();
}
