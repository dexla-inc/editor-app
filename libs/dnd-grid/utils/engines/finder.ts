import { useEditorStore } from "@/stores/editor";
import { MutableRefObject } from "react";
import { getAllIds } from "@/libs/dnd-grid/utils/editor";
import { ComponentTree } from "@/utils/editor";

/**
 * Retrieves the base element within the iframe, prioritizing
 * the ".iframe-canvas-Modal-body" if it exists.
 *
 * @returns The base HTMLElement or Document.
 */
export const getBaseElement = (): Element | Document | null => {
  const { iframeWindow } = useEditorStore.getState();

  if (!iframeWindow?.document) return null;

  const modalBody = iframeWindow.document.querySelectorAll(
    ".iframe-canvas-Modal-body, .iframe-canvas-Drawer-body",
  );

  return modalBody.length ? modalBody[0] : iframeWindow.document;
};

/**
 * Retrieves the ID of the base element. If the base element is a document,
 * returns a default ID ("main-grid").
 *
 * @returns The ID of the base element.
 */
export const getBaseElementId = (): string => {
  const baseElement = getBaseElement();

  if (!baseElement) return "main-grid"; // Fallback ID

  if (baseElement.constructor.name !== "HTMLDocument") {
    const element = baseElement as HTMLElement;
    const id = element.getAttribute("id");
    return id ? id : "main-grid"; // Fallback if ID is absent
  }

  return "main-grid";
};

/**
 * Retrieves an element by its ID within the base context.
 *
 * @param id - The ID of the element to retrieve.
 * @returns The HTMLElement if found; otherwise, null.
 */
export const getElementByIdInContext = (id: string): HTMLElement | null => {
  const baseElement = getBaseElement();
  const { iframeWindow } = useEditorStore.getState();
  if (!baseElement) return null;

  if (baseElement.constructor.name !== "HTMLDocument") {
    // In case when the modal is dragged, the context element id must be different from the dragged element id
    if (!(baseElement as Element).id.includes(id)) {
      return (
        baseElement.querySelectorAll<HTMLElement>(
          `[id^="${id}"], [data-id^="${id}"]`,
        )[0] ?? null
      );
    }
  }

  // Force find the element by ID in the iframe window if the conditions above are not met
  return (
    iframeWindow?.document.querySelectorAll<HTMLElement>(
      `[id^="${id}"], [data-id^="${id}"]`,
    )[0] ?? null
  );
};

export const getElementRects = (
  currComponentId: string,
  components: ComponentTree,
) => {
  const allIds = getAllIds(components, {
    filterFromParent: currComponentId,
  });

  const targets = allIds.reduce<Record<string, DOMRect>>((acc, id) => {
    if (currComponentId !== id) {
      const element = getElementByIdInContext(id);
      if (element) {
        acc[id] = element.getBoundingClientRect();
      }
    }
    return acc;
  }, {});
  return targets;
};
