import type { MutableRefObject } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { ComponentTree } from "@/utils/editor";

export interface TreeItem extends ComponentTree {
  collapsed?: boolean;
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
