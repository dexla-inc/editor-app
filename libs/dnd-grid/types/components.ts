export enum DataType {
  static = "static",
  dynamic = "dynamic",
  boundCode = "boundCode",
  rules = "rules",
}

export type ComponentStructure = {
  children?: ComponentStructure[];
} & Component;

type ComponentBase = {
  id: string;
  name: string;
};

export type Component = {
  description?: string;
  title?: string;
  props: { [key: string]: any; dataType?: DataType };
  blockDroppingChildrenInside?: boolean;
  fixedPosition?: {
    position: "left" | "top";
    target: string;
  };
  actions?: any[];
  onLoad?: any;
  states?: Record<string, any>;
  languages?: Record<string, any>;
  isBeingAdded?: boolean;

  // page structure props - can be removed if we change page structure solution
  depth?: number;
} & ComponentBase;

export type ComponentTree = {
  blockDroppingChildrenInside?: boolean;
  children?: ComponentTree[];
} & ComponentBase;

export type EditableComponentMapper = {
  id: string;
  renderTree: any;
  component: ComponentTree & Component;
  shareableContent?: any;
  onClick: (id: string) => void;
  // style?: CSSObject & { display?: string | ValueProps };
};
