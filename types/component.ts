import { ComponentTree } from "@/utils/editor";

export type RenderTreeFunc = (
  componentTree: ComponentTree,
  shareableContent?: Record<string, any>,
) => any;

export type WithComponentWrapperProps = {
  id?: string;
  component: ComponentTree;
  renderTree: RenderTreeFunc;
  shareableContent?: any;
};

export type ShareableContentProps = {
  relatedComponentsData: Record<string, any>;
  parentSuffix?: string;
  parentState?: string;
};
