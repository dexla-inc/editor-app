import { ComponentStructure } from "@/utils/editor";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Coordinates = { gridColumn: string; gridRow: string; parentId: string };

interface State {
  components: ComponentStructure;
  setComponents: (components: ComponentStructure) => void;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  resetTree: () => void;
  elementRects: ElementRects;
  setElementRects: (elementRects: ElementRects) => void;
  validComponent: string | null;
  setValidComponent: (id: string | null) => void;
  invalidComponent: string | null;
  setInvalidComponent: (id: string | null) => void;
  isInteracting: boolean;
  setIsInteracting: (isInteracting: boolean) => void;
  draggableComponent: ComponentStructure | null;
  setDraggableComponent: (
    draggableComponent: ComponentStructure | null,
  ) => void;
  coords: Coordinates;
  setCoords: (coords: Coordinates) => void;
  hoverComponentId: string | null;
  setHoverComponentId: (id: string | null) => void;
}

interface ElementRects {
  [key: string]: DOMRect;
}

const initialTree = {
  id: "main-grid",
  name: "container",
  description: "Container",
  blockDroppingChildrenInside: false,
  children: [],
} as unknown as ComponentStructure;

export const useEditorStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        components: initialTree,
        selectedComponentId: null,
        validComponent: null,
        invalidComponent: null,
        setComponents: (components: ComponentStructure) =>
          set({ components }, false, "setComponents"),
        setSelectedComponentId: (id: string | null) =>
          set({ selectedComponentId: id }, false, "setSelectedComponentId"),
        resetTree: () =>
          set(
            { components: initialTree, selectedComponentId: null },
            false,
            "resetTree",
          ),
        elementRects: {} as ElementRects,
        setElementRects: (elementRects: ElementRects) =>
          set({ elementRects }, false, "setElementRects"),
        setValidComponent: (id: string | null) =>
          set({ validComponent: id }, false, "setValidComponent"),
        setInvalidComponent: (id: string | null) =>
          set({ invalidComponent: id }, false, "setInvalidComponent"),
        isInteracting: false,
        setIsInteracting: (isInteracting: boolean) =>
          set({ isInteracting }, false, "setIsInteracting"),
        draggableComponent: null,
        setDraggableComponent: (
          draggableComponent: ComponentStructure | null,
        ) => set({ draggableComponent }, false, "setComponentToAdd"),
        coords: {
          gridColumn: "",
          gridRow: "",
          parentId: "",
        },
        setCoords: (coords: Coordinates) => set({ coords }, false, "setCoords"),
        hoverComponentId: null,
        setHoverComponentId: (hoverComponentId: string | null) =>
          set({ hoverComponentId }, false, "setHoverComponentId"),
      }),
      {
        name: "editor-storage",
        partialize: (state: State) => ({ components: state.components }),
      },
    ),
    { name: "EditorStore" },
  ),
);
