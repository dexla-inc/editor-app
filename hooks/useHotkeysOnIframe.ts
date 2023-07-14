import { useEditorStore } from "@/stores/editor";
import {
  HotkeyItemOptions,
  getHotkeyHandler,
  getHotkeyMatcher,
} from "@/utils/parseHotkeys";
import { useEffect } from "react";

export type { HotkeyItemOptions };
export { getHotkeyHandler };

export type HotkeyItem = [
  string,
  (event: KeyboardEvent) => void,
  HotkeyItemOptions?
];

function shouldFireEvent(
  event: KeyboardEvent,
  tagsToIgnore: string[],
  triggerOnContentEditable = false
) {
  if (event.target instanceof HTMLElement) {
    if (triggerOnContentEditable) {
      return !tagsToIgnore.includes(event.target.tagName);
    }

    return (
      !event.target.isContentEditable &&
      !tagsToIgnore.includes(event.target.tagName)
    );
  }

  return true;
}

export function useHotkeysOnIframe(
  hotkeys: HotkeyItem[],
  tagsToIgnore: string[] = ["INPUT", "TEXTAREA", "SELECT"],
  triggerOnContentEditable = false
) {
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      hotkeys.forEach(
        ([hotkey, handler, options = { preventDefault: true }]) => {
          if (
            getHotkeyMatcher(hotkey)(event) &&
            shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)
          ) {
            if (options.preventDefault) {
              event.preventDefault();
            }

            handler(event);
          }
        }
      );
    };

    iframeWindow?.document.documentElement.addEventListener(
      "keydown",
      keydownListener
    );
    return () =>
      iframeWindow?.document.documentElement.removeEventListener(
        "keydown",
        keydownListener
      );
  }, [
    hotkeys,
    iframeWindow?.document.documentElement,
    tagsToIgnore,
    triggerOnContentEditable,
  ]);
}
