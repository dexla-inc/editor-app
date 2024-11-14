import { ComponentStructure } from "@/utils/editor";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Coordinates = { gridColumn: string; gridRow: string; parentId: string };

interface State {
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
}

export const useDndGridStore = create<State>()(
  devtools(
    (set) => ({
      validComponent: null,
      invalidComponent: null,
      setValidComponent: (id: string | null) =>
        set({ validComponent: id }, false, "setValidComponent"),
      setInvalidComponent: (id: string | null) =>
        set({ invalidComponent: id }, false, "setInvalidComponent"),
      isInteracting: false,
      setIsInteracting: (isInteracting: boolean) =>
        set({ isInteracting }, false, "setIsInteracting"),
      draggableComponent: null,
      setDraggableComponent: (draggableComponent: ComponentStructure | null) =>
        set({ draggableComponent }, false, "setComponentToAdd"),
      coords: {
        gridColumn: "",
        gridRow: "",
        parentId: "",
      },
      setCoords: (coords: Coordinates) => set({ coords }, false, "setCoords"),
    }),
    { name: "DnDGridStore" },
  ),
);
