import { ComponentTree } from "@/utils/editor";

export type RenderTreeFunc = (
  componentTree: ComponentTree,
  shareableContent?: Record<string, any>,
) => any;

export type WithComponentWrapperProps = {
  component: ComponentTree;
  renderTree: RenderTreeFunc;
  shareableContent?: any;
};
