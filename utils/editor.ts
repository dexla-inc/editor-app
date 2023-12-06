import { Tile } from "@/components/templates/dashboard";
import { PageResponse } from "@/requests/pages/types";
import {
  MantineThemeExtended,
  emptyEditorTree,
  useEditorStore,
} from "@/stores/editor";
import { Action, ChangeStepAction } from "@/utils/actions";
import { GRAY_OUTLINE } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { GRID_SIZE } from "@/utils/config";
import { calculateGridSizes } from "@/utils/grid";
import { templatesMapper } from "@/utils/templatesMapper";
import cloneDeep from "lodash.clonedeep";
import debounce from "lodash.debounce";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import pickBy from "lodash.pickby";
import { nanoid } from "nanoid";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { CSSProperties } from "react";
import crawl from "tree-crawl";

export type Component = {
  id?: string;
  name: string;
  description?: string;
  title?: string;
  children?: Component[];
  props?: { [key: string]: any };
  blockDroppingChildrenInside?: boolean;
  fixedPosition?: {
    position: "left" | "top";
    target: string;
  };
  actions?: Action[];
  states?: Record<string, any>;
  languages?: Record<string, any>;
};

export type Row = {
  columns: number;
  components: Component[];
};

export type EditorTree = {
  root: Component;
  name: string;
  timestamp: number;
};

export type DropTarget = {
  id: string;
  edge: Edge;
};

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0],
  );

  return newArray;
}

export const replaceIdsDeeply = (treeRoot: Component) => {
  let stepperId = "";

  crawl(
    treeRoot,
    (node) => {
      const newId = nanoid();

      if (node.name === "Stepper") {
        stepperId = newId;
      }

      node.id = newId;
      const changeStepActionIndex = (node.actions || []).findIndex(
        (action) => action.action.name === "changeStep",
      );
      if (changeStepActionIndex > -1) {
        (
          node.actions![changeStepActionIndex].action as ChangeStepAction
        ).stepperId = stepperId;
      }
    },
    { order: "bfs" },
  );
};

// TODO: put Select field here
const inputFields = ["input", "checkbox", "textarea"];
export const updateInputFieldsWithFormData = (
  treeRoot: Component,
  onChange: any,
) => {
  crawl(
    treeRoot,
    (node) => {
      if (inputFields.includes(node.name.toLowerCase())) {
        const currOnChange = node?.props?.triggers?.onChange ?? false;
        node.props = merge(node.props, {
          triggers: {
            onChange: (e: any) => {
              currOnChange && currOnChange(e);
              onChange(e);
            },
          },
        });
      }
    },
    { order: "bfs" },
  );
};

export const traverseComponents = (
  components: Component[],
  theme: MantineThemeExtended,
  pages: PageResponse[],
): Component[] => {
  return components
    .filter((c) => !!c.name)
    .map((component) => {
      const isTable = component.name === "Table";

      let tableData = {};
      if (isTable && component?.props?.data?.length > 0) {
        const headers = Object.keys(component?.props?.data[0]).reduce(
          (acc, key) => {
            return {
              ...acc,
              [key]: true,
            };
          },
          {},
        );

        tableData = {
          headers,
          config: { filter: false, sorting: false, pagination: false },
        };
      }

      const structureDefinition = structureMapper[component.name];

      const newComponent = structureDefinition.structure({
        ...component,
        props: {
          ...(component?.props ?? {}),
          ...(isTable
            ? {
                exampleData: { value: component?.props?.data ?? {} },
                ...tableData,
              }
            : {}),
        },
        theme,
        pages,
      });
      if (component.children) {
        newComponent.children = traverseComponents(
          component.children,
          theme,
          pages,
        );
      }

      return newComponent;
    });
};

export const getEditorTreeFromPageStructure = (
  tree: { rows: Row[] },
  theme: MantineThemeExtended,
  pages: PageResponse[],
) => {
  const editorTree: EditorTree = {
    name: "Initial State",
    timestamp: Date.now(),
    root: {
      ...emptyEditorTree.root,
      children: [
        {
          id: "content-wrapper",
          name: "Container",
          description: "Root Container",
          props: {
            style: {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              minHeight: "20px",
            },
          },
          children: tree.rows.map((row: Row) => {
            return {
              id: nanoid(),
              name: "Container",
              description: "Container",
              props: {
                style: {
                  width: "100%",
                  backgroundColor: "White.6",
                  display: "flex",
                  flexDirection: "row",
                },
              },
              children: traverseComponents(row.components, theme, pages),
            };
          }),
        },
      ],
    },
  };

  return editorTree;
};

export const getEditorTreeFromTemplateData = (
  tree: { template: { name: string; data: any } },
  theme: MantineThemeExtended,
  pages: PageResponse[],
) => {
  // @ts-ignore
  const editorTree: EditorTree = templatesMapper[tree.template.name](
    tree.template.data,
    theme,
    pages,
  );
  return editorTree;
};

export const getEditorTreeFromTemplateTileData = async (
  tree: { template: { name: string; tiles: Tile[] } },
  theme: MantineThemeExtended,
  pages: PageResponse[],
  projectId: string,
  pageId: string,
) => {
  // @ts-ignore
  const editorTree: EditorTree = await templatesMapper[tree.template.name](
    tree.template,
    theme,
    pages,
    projectId,
    pageId,
  );
  return editorTree;
};

export const getNewComponents = (
  tree: { rows: Row[] },
  theme: MantineThemeExtended,
  pages: PageResponse[],
  fromAi?: boolean,
): Component => {
  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    props: {
      isBeingAdded: true,
      style: {
        width: "100%",
        flexDirection: "column",
      },
    },
    children: tree.rows.map((row: Row) => {
      return {
        id: nanoid(),
        name: "Container",
        description: "Container",
        props: {
          style: {
            width: "100%",
            rowGap: fromAi ? "8px" : "0px",
            columnGap: fromAi ? "8px" : "0px",
          },
        },
        children:
          row.components && row.components.length > 0
            ? traverseComponents(row.components, theme, pages)
            : [],
      };
    }),
  };
};

export const getNewComponent = (
  components: Component[],
  theme: MantineThemeExtended,
  pages: PageResponse[],
): Component => {
  const firstComponent = components[0];
  const structureDefinition = structureMapper[firstComponent.name];
  const firstComponentStructure = structureDefinition.structure({
    ...firstComponent,
    props: {
      ...(firstComponent?.props ?? {}),
    },
    theme,
    pages,
  });

  return {
    id: nanoid(),
    name: firstComponentStructure.name,
    description: firstComponentStructure.name,
    props: { ...firstComponentStructure.props },
    children:
      firstComponent.children && firstComponent.children.length > 0
        ? traverseComponents(firstComponent.children, theme, pages)
        : [],
  };
};

export type TileType = {
  node: Component;
  name: string;
  count: number;
};

export const getTiles = (treeRoot: Component): TileType[] => {
  let tiles: TileType[] = [];

  crawl(
    treeRoot,
    (node) => {
      const name = node.description?.replace(".tile", "");
      if (
        node.description?.endsWith(".tile") &&
        !tiles.find((t) => t.name === name)
      ) {
        tiles.push({ name: name as string, node, count: 1 });
      } else {
        tiles = tiles.map((t) => {
          if (t.name === name) {
            return { ...t, count: t.count + 1 } as TileType;
          }

          return t as TileType;
        });
      }
    },
    { order: "bfs" },
  );

  return tiles;
};

export const getTileData = (treeRoot: Component): { [key: string]: any } => {
  let data: { [key: string]: any } = {};

  crawl(
    treeRoot,
    (node) => {
      if (node.description?.startsWith("tile.data.")) {
        let type = "string";
        // TODO: Handle unique types of charts, like PieChart that needs different data
        if (node.name.endsWith("Chart")) {
          type = `{
            data: {
              series: { 
                name: string; 
                data: number[] 
              }[]
              xaxis: { categories: string[] }
            }
          }`;
        }

        if (node.name === "Table") {
          type = `{
            data: {
              value: { [key: string]: any }[]
            }
          }`;
        }

        data = {
          ...data,
          [node.description.replace("tile.data.", "")]: type,
        };
      }
    },
    { order: "bfs" },
  );

  return data;
};

// recursively replace all tile.data with the actual tile data
const replaceTileData = (node: Component, tile: any, entities: object) => {
  if (node.description?.startsWith("tile.data.")) {
    const key = node.description?.replace("tile.data.", "");
    const val = tile.data[key];

    if (node.name === "Text" || node.name === "Title") {
      // @ts-ignore
      node.props.children = val;
    }

    if (node.name.endsWith("Chart")) {
      try {
        const data = typeof val === "string" ? JSON.parse(val).data : val.data;
        // @ts-ignore
        node.props = {
          ...node.props,
          ...data,
        };
      } catch (error) {
        // do nothing
      }
    }

    // @ts-ignore
    node.props.data = { value: val };
  }

  if (node.children) {
    node.children?.map((child) => replaceTileData(child, tile, entities)) ?? [];
  }

  return node;
};

export const replaceTilesData = (
  tree: EditorTree,
  tiles: any[],
  entities: object,
): EditorTree => {
  crawl(
    tree.root,
    (node) => {
      console.log(node);
      if (node.description?.endsWith(".tile")) {
        const name = node.description?.replace(".tile", "");
        const tile = tiles.find((t) => t.name === `${name}Tile`);

        // @ts-ignore
        node.children =
          node.children?.map((child) =>
            replaceTileData(child, tile, entities as object),
          ) ?? [];
      }
    },
    { order: "bfs" },
  );

  return tree;
};

export const getComponentById = (
  treeRoot: Component,
  id: string,
): Component | null => {
  let found: Component | null = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        found = node as Component;
        context.break();
      }
    },
    { order: "bfs" },
  );

  return found;
};

export const getAllComponentsByIds = (
  treeRoot: Component,
  ids: string[],
): Component[] => {
  let found: Component[] = [];

  crawl(
    treeRoot,
    (node, context) => {
      if (ids.includes(node.id!)) {
        found.push(node);
      }
    },
    { order: "bfs" },
  );

  return found;
};

export const getComponentBeingAddedId = (
  treeRoot: Component,
): string | null => {
  let id = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.props?.isBeingAdded === true) {
        id = node.id;
        context.break();
      }
    },
    { order: "bfs" },
  );

  return id;
};

const translatableFieldsKeys = [
  "children",
  "label",
  "title",
  "alt",
  "placeholder",
  "data",
  "tooltip",
];

const styleFieldsKeys = [
  "styles",
  "style",
  "sx",
  "size",
  "bg",
  "color",
  "variant",
  "textColor",
  "leftIcon",
  "icon",
  "orientation",
  "weight",
];

const pickTranslatableFields = (value: string, key: string) => {
  return value !== "" && translatableFieldsKeys.includes(key);
};

const pickStyleFields = (value: string, key: string) => {
  return value !== "" && styleFieldsKeys.includes(key);
};

export const updateTreeComponentAttrs = (
  treeRoot: Component,
  ids: string[],
  attrs: Partial<Component>,
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (ids.includes(node.id!)) {
        merge(node, attrs);
        context.break();
      }
    },
    { order: "bfs" },
  );
};

export const updateTreeComponent = (
  treeRoot: Component,
  ids: string | string[],
  props: any,
  state: string = "default",
  language: string = "default",
) => {
  ids = Array.isArray(ids) ? ids : [ids];

  const translatableFields = pickBy(props, pickTranslatableFields);
  const styleFields = pickBy(props, pickStyleFields);
  const alwaysDefaultFields = omit(props, [
    ...translatableFieldsKeys,
    ...styleFieldsKeys,
  ]);

  crawl(
    treeRoot,
    (node, context) => {
      if (ids.includes(node.id!)) {
        if (language === "default") {
          node.props = merge(node.props, translatableFields);
        } else {
          node.languages = merge(node.languages, {
            [language]: translatableFields,
          });
        }

        if (state === "default") {
          node.props = merge(node.props, styleFields);
        } else {
          node.states = merge(node.states, {
            [state]: styleFields,
          });
        }

        node.props = merge(node.props, alwaysDefaultFields);

        // context.break();
      }
    },
    { order: "bfs" },
  );
};

export const updateTreeComponentChildren = (
  treeRoot: Component,
  id: string,
  children: Component[],
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        node.children = children;
        context.break();
      }
      // // @ts-ignore
      // delete node.collapsed;
      // // @ts-ignore
      // delete node.depth;
      // // @ts-ignore
      // delete node.index;
      // // @ts-ignore
      // delete node.parentId;
    },
    { order: "bfs" },
  );
};

export const updateTreeComponentWithOmitProps = (treeRoot: Component) => {
  crawl(
    treeRoot,
    (node, context) => {
      // @ts-ignore
      delete node.collapsed;
      // @ts-ignore
      delete node.depth;
      // @ts-ignore
      delete node.index;
      // @ts-ignore
      delete node.parentId;
    },
    { order: "bfs" },
  );
};

export const updateTreeComponentActions = (
  treeRoot: Component,
  id: string,
  actions: Action[],
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        node.actions = actions;
        context.break();
      }
    },
    { order: "bfs" },
  );
};

export const updateTreeComponentDescription = (
  treeRoot: Component,
  id: string,
  description: string,
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        node.description = description;
        context.break();
      }
    },
    { order: "bfs" },
  );
};

export const checkIfIsChild = (treeRoot: Component, childId: string) => {
  let isChild = false;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === childId) {
        isChild = true;
        context.break();
      }
    },
    { order: "bfs" },
  );

  return isChild;
};

export const checkIfIsChildDeep = (
  treeRoot: Component,
  childId: string,
): boolean => {
  let isChild = checkIfIsChild(treeRoot, childId);

  if (!isChild && (treeRoot.children ?? [])?.length > 0) {
    const length = (treeRoot.children ?? []).length;
    for (let i = 0; i < length; i++) {
      if (isChild) {
        break;
      }
      // @ts-ignore
      isChild = checkIfIsChildDeep(treeRoot.children[i], childId);
    }
  }

  return isChild;
};

export const checkIfIsDirectAncestor = (
  treeRoot: Component,
  childId: string,
  possibleAncestorId: string,
) => {
  let possibleAncestorDepth = null;
  let childDepth = 0;
  let isDirectChild = false;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === possibleAncestorId) {
        possibleAncestorDepth = context.depth;
        isDirectChild = checkIfIsChildDeep(node, childId);
      } else if (node.id === childId) {
        childDepth = context.depth;
        context.break();
      }
    },
    { order: "pre" },
  );

  return (
    possibleAncestorDepth && possibleAncestorDepth < childDepth && isDirectChild
  );
};

export const getAllParentsWithExampleData = (
  treeRoot: Component,
  childId: string,
): Component[] => {
  const parentsWithExampleData: any[] = [];
  crawl(
    treeRoot,
    (node) => {
      const isDirectAncestor = checkIfIsDirectAncestor(
        treeRoot,
        childId,
        node.id!,
      );

      if (isDirectAncestor && !isEmpty(node.props?.exampleData?.value)) {
        parentsWithExampleData.push(node);
      }
    },
    { order: "pre" },
  );

  return parentsWithExampleData;
};

export const getComponentParent = (
  treeRoot: Component,
  id: string,
): Component | null => {
  let parent: Component | null = null;
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        parent = context.parent;
        context.break();
      }
    },
    { order: "bfs" },
  );

  return parent;
};

export const getAllComponentsByName = (
  treeRoot: Component,
  componentName: string | string[],
): Component[] => {
  const components: Component[] = [];

  if (!Array.isArray(componentName)) {
    componentName = [componentName];
  }

  crawl(
    treeRoot,
    (node) => {
      if (componentName.includes(node.name)) {
        components.push(node);
      }
    },
    { order: "bfs" },
  );

  return components;
};

export const getAllChildrenComponents = (treeRoot: Component): Component[] => {
  const components: Component[] = [];

  crawl(
    treeRoot,
    (node) => {
      components.push(node);
    },
    { order: "bfs" },
  );

  return components;
};

export const resetContentWrapperWidth = (treeRoot: Component) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === "content-wrapper") {
        // @ts-ignore
        node.props.style.width = "100%";
        context.break();
      }
    },
    { order: "bfs" },
  );
};

export const getComponentIndex = (parent: Component, id: string) => {
  if (!parent) return -1;
  return (
    parent.children?.findIndex((child: Component) => child.id === id) ?? -1
  );
};

export const addComponent = (
  treeRoot: Component,
  componentToAdd: Component,
  dropTarget: DropTarget,
  dropIndex?: number,
): string => {
  const copy = cloneDeep(componentToAdd);
  replaceIdsDeeply(copy);
  const directChildren = ["Modal", "Drawer", "Toast"];
  const isGrid = copy.name === "Grid";
  const isColumn = copy.name === "GridColumn";
  const isNavbar = copy.name === "Navbar";
  let targetComponent = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (isNavbar) {
        const contentWrapper = treeRoot.children?.find(
          (child) => child.id === "content-wrapper",
        );
        if (contentWrapper) {
          contentWrapper.props = {
            ...contentWrapper.props,
            navbarWidth: componentToAdd.props?.style.width,
          };
        }
      }
      if ((isGrid || isColumn) && node.id === dropTarget.id) {
        targetComponent = addNodeToTarget(
          treeRoot,
          node,
          copy,
          context,
          dropTarget,
          false,
          false,
          dropIndex,
        );

        context.break();
      } else {
        if (copy.fixedPosition) {
          if (node.id === copy.fixedPosition.target) {
            if (
              copy.fixedPosition.position === "left" ||
              copy.fixedPosition.position === "top"
            ) {
              node.children = [copy, ...(node.children || [])];
            } else if (
              copy.fixedPosition.position === "right" ||
              copy.fixedPosition.position === "bottom"
            ) {
              node.children = [...(node.children || []), copy];
            }

            context.break();
          }
        } else {
          if (
            directChildren.includes(copy.name) &&
            node.id === "content-wrapper"
          ) {
            node.children = [...(node.children || []), copy];
            context.break();
          } else if (node.id === dropTarget.id) {
            const isPopOver = copy.name === "PopOver";
            if (isPopOver) {
              copy.props!.targetId = node.id;
              copy.children = [...(copy.children || []), node];
              context.parent?.children?.splice(context.index, 0, copy);
            } else {
              node.children = node.children ?? [];

              if (dropTarget.edge === "left" || dropTarget.edge === "top") {
                const index = dropIndex ?? context.index - 1;
                node.children.splice(index, 0, copy);
              } else if (["right", "bottom"].includes(dropTarget.edge)) {
                const index = dropIndex ?? context.index + 1;
                node.children.splice(index, 0, copy);
              } else if (dropTarget.edge === "center") {
                node.children = [...(node.children || []), copy];
              }
            }

            context.break();
          }
        }
      }
    },
    { order: "bfs" },
  );

  if ((isGrid || isColumn) && targetComponent) {
    calculateGridSizes(targetComponent);
  }

  return copy.id as string;
};

export type Edge = "left" | "right" | "top" | "bottom" | "center";

export const getClosestEdge = (
  left: number,
  right: number,
  top: number,
  bottom: number,
) => {
  const all = { left, right, top, bottom, center: Infinity };
  const closest = Math.min(...Object.values(all));
  const closestKey = Object.keys(all).find((key: string) => {
    return all[key as Edge] === closest;
  });

  return { edge: closestKey, value: all[closestKey as Edge] };
};

export const debouncedTreeComponentChildrenUpdate = debounce(
  (value: Component[], save = true) => {
    const updateTreeComponentChildren =
      useEditorStore.getState().updateTreeComponentChildren;
    const selectedComponentId = useEditorStore.getState().selectedComponentId;

    updateTreeComponentChildren(selectedComponentId as string, value, save);
  },
  300,
);

export const debouncedTreeComponentStyleUpdate = debounce(
  (...params: any[]) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    const updateTreeComponents = useEditorStore.getState().updateTreeComponents;

    if (Array.isArray(params[0])) {
      const [componentIds, styleUpdate] = params;
      updateTreeComponents(componentIds, { style: { ...styleUpdate } });
    } else {
      const [componentId, styleUpdate] = params;
      updateTreeComponent(componentId, { style: { ...styleUpdate } });
    }
  },
  300,
);

export const debouncedTreeUpdate = debounce((...params: any[]) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const updateTreeComponents = useEditorStore.getState().updateTreeComponents;
  if (Array.isArray(params[0])) {
    // @ts-ignore
    updateTreeComponents(...params);
  } else {
    // @ts-ignore
    updateTreeComponent(...params);
  }
}, 300);

export const debouncedTreeComponentDescriptionpdate = debounce(
  (value: string) => {
    const updateTreeComponentDescription =
      useEditorStore.getState().updateTreeComponentDescription;
    const selectedComponentId = useEditorStore.getState().selectedComponentId;

    updateTreeComponentDescription(selectedComponentId!, value);
  },
  300,
);

export const debouncedTreeRootChildrenUpdate = debounce(
  (value: Component[], save = true) => {
    const updateTreeComponentChildren =
      useEditorStore.getState().updateTreeComponentChildren;
    const tree = useEditorStore.getState().tree;

    updateTreeComponentChildren(tree.root.id as string, value, save);
  },
  300,
);

export const getColorFromTheme = (
  theme: MantineThemeExtended,
  colorName = "",
) => {
  if (colorName === "transparent") {
    return "transparent";
  }
  const [section, index] = colorName.split(".");
  const colorSection = theme.colors[section];
  return index !== undefined && colorSection
    ? colorSection[Number(index)]
    : section;
};

export const componentStyleMapper = (
  componentName: string,
  { style }: { style: CSSProperties },
) => {
  const { background, backgroundColor, color, ...rest } = style;
  const result = merge({}, { style: rest });

  if (componentName === "Button") {
    merge(result, {
      color: background ?? backgroundColor,
      textColor: color,
    });
  }

  if (
    ["Container", "NavLink", "Icon", "RadioItem", "Navbar", "AppBar"].includes(
      componentName,
    )
  ) {
    merge(result, {
      bg: background ?? backgroundColor,
    });
  }

  if ("NavLink" === componentName) {
    merge(result, {
      align: rest.textAlign,
      color,
    });
  }

  if (
    ["Text", "Checkbox", "Divider", "Button", "Select", "Input"].includes(
      componentName,
    )
  ) {
    merge(result, {
      color,
      size: rest.fontSize,
      weight: rest.fontWeight,
    });
  }

  return result;
};

const addNodeToTarget = (
  treeRoot: Component,
  targetNode: Component,
  copy: Component,
  context: crawl.Context<Component>,
  dropTarget: DropTarget,
  isMoving?: boolean,
  forceTarget?: boolean,
  dropIndex?: number,
) => {
  const parent = context.parent as Component;
  const isAddingToXAxis =
    dropTarget.edge === "left" || dropTarget.edge === "right";
  const isAddingToYAxis =
    dropTarget.edge === "top" || dropTarget.edge === "bottom";
  let target =
    isAddingToXAxis || isAddingToYAxis
      ? forceTarget
        ? targetNode
        : parent
      : targetNode;

  if (dropTarget.edge === "center") {
    targetNode.children = [...(targetNode.children || []), copy];

    copy.props!.resized = false;
    copy.children = copy.children?.map((child) => {
      child.props!.resized = false;
      return child;
    });

    if (copy.props?.resetTargetResized && !isMoving) {
      target.props!.resized = false;
      target.children = target.children?.map((child) => {
        child.props!.resized = false;
        return child;
      });
    }

    return target;
  }
  const shouldRemoveResizing = target.name === "Grid" && isAddingToXAxis;

  if (shouldRemoveResizing) {
    copy.props!.resized = false;
    target.children = target.children?.map((child) => {
      child.props!.resized = false;
      return child;
    });
  }

  if (dropTarget.edge === "top") {
    if (targetNode.name === "GridColumn" && !forceTarget) {
      target = getComponentParent(treeRoot, parent.id!)!;
      dropIndex = getComponentIndex(target, parent.id!);
    }

    if (isMoving) {
      const dropTargetParent = getComponentParent(treeRoot, dropTarget.id!);
      const items = (target?.children?.map((c) => c.id) ?? []) as string[];
      const oldIndex = items.indexOf(copy.id!);
      let newIndex = items.indexOf(dropTargetParent?.id!);

      if (newIndex > oldIndex) {
        newIndex = Math.max(newIndex - 1, 0);
      }

      if (oldIndex !== newIndex) {
        const newPositions = arrayMove(items, oldIndex, newIndex);
        target!.children = parent?.children?.sort((a, b) => {
          const aIndex = newPositions.indexOf(a.id as string);
          const bIndex = newPositions.indexOf(b.id as string);
          return aIndex - bIndex;
        });
      }
    } else {
      let i = dropIndex;
      if (typeof dropIndex === "undefined") {
        i = context.index;
      }

      // @ts-ignore
      target.children?.splice(i, 0, copy);
    }

    return target;
  }

  if (dropTarget.edge === "bottom") {
    if (targetNode.name === "GridColumn" && !forceTarget) {
      target = getComponentParent(treeRoot, parent.id!)!;
      dropIndex = getComponentIndex(target, parent.id!) + 1;
    }

    if (isMoving) {
      const dropTargetParent = getComponentParent(treeRoot, dropTarget.id!);
      const items = (target?.children?.map((c) => c.id) ?? []) as string[];
      const oldIndex = items.indexOf(copy.id!);
      let newIndex = items.indexOf(dropTargetParent?.id!);

      if (newIndex < oldIndex) {
        newIndex = Math.min(newIndex + 1, items.length);
      }

      if (oldIndex !== newIndex) {
        const newPositions = arrayMove(items, oldIndex, newIndex);
        target!.children = parent?.children?.sort((a, b) => {
          const aIndex = newPositions.indexOf(a.id as string);
          const bIndex = newPositions.indexOf(b.id as string);
          return aIndex - bIndex;
        });
      }
    } else {
      let i = dropIndex;
      if (typeof dropIndex === "undefined") {
        i = context.index + 1;
      }

      target.children?.splice(i!, 0, copy);
    }

    return target;
  }

  const gridColumn = {
    id: nanoid(),
    name: "GridColumn",
    description: "GridColumn",
    props: {
      span: GRID_SIZE,
      style: {
        height: "auto",
        outline: GRAY_OUTLINE,
        outlineOffset: "-2px",
      },
    },
    children: [copy],
  } as Component;

  if (dropTarget.edge === "left") {
    let i = dropIndex;
    if (typeof dropIndex === "undefined") {
      i = context.index - 1 < 0 ? 0 : context.index;
    }
    // @ts-ignore
    target.children?.splice(i, 0, gridColumn);
  } else if (dropTarget.edge === "right") {
    let i = dropIndex;
    if (typeof dropIndex === "undefined") {
      i = context.index + 1;
    }
    // @ts-ignore
    target.children?.splice(i, 0, gridColumn);
  }

  return target;
};

export const moveComponent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget,
) => {
  let targetComponent = null;
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        const isGrid = node.name === "Grid";
        if (isGrid) {
          targetComponent = addNodeToTarget(
            treeRoot,
            context.parent!,
            node,
            context,
            dropTarget,
            true,
            true,
          );
        } else {
          const parent = context.parent;
          const items = (parent?.children?.map((c) => c.id) ?? []) as string[];
          const oldIndex = items.indexOf(id);
          let newIndex = items.indexOf(dropTarget.id);

          if (
            ["top", "left"].includes(dropTarget.edge) &&
            oldIndex < newIndex
          ) {
            newIndex = Math.max(newIndex - 1, 0);
          } else if (
            ["right", "bottom", "center"].includes(dropTarget.edge) &&
            newIndex < oldIndex
          ) {
            newIndex = Math.min(newIndex + 1, items.length);
          }

          if (oldIndex !== newIndex) {
            const newPositions = arrayMove(items, oldIndex, newIndex);
            parent!.children = parent?.children?.sort((a, b) => {
              const aIndex = newPositions.indexOf(a.id as string);
              const bIndex = newPositions.indexOf(b.id as string);
              return aIndex - bIndex;
            });
          }
        }

        context.break();
      }
    },
    { order: "bfs" },
  );

  if (targetComponent) {
    calculateGridSizes(targetComponent);
  }
};

export const moveComponentToDifferentParent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget,
  newParentId: string,
) => {
  const componentToAdd = getComponentById(treeRoot, id) as Component;
  const isGrid = componentToAdd.name === "Grid";
  let targetComponent = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === newParentId) {
        if (isGrid) {
          const isHorizontalAxis =
            dropTarget.edge === "right" || dropTarget.edge === "left";
          const dropIndex = node.children?.findIndex(
            (c) => c.id === dropTarget.id,
          ) as number;

          targetComponent = addNodeToTarget(
            treeRoot,
            node,
            componentToAdd,
            context,
            dropTarget,
            false,
            isHorizontalAxis,
            isHorizontalAxis
              ? dropTarget.edge === "right"
                ? dropIndex + 1
                : dropIndex
              : undefined,
          );
        } else {
          if (dropTarget.edge === "left" || dropTarget.edge === "top") {
            const dropIndex = node.children?.findIndex(
              (c) => c.id === dropTarget.id,
            );
            node.children?.splice(
              Math.max(dropIndex || 0, 0),
              0,
              componentToAdd,
            );
          } else if (
            dropTarget.edge === "right" ||
            dropTarget.edge === "bottom" ||
            dropTarget.edge === "center"
          ) {
            if (!node.children) {
              node.children = [];
            }

            const dropIndex = node.children.findIndex(
              (c) => c.id === dropTarget.id,
            );
            node.children.splice(
              Math.min((dropIndex || 0) + 1, node.children.length),
              0,
              componentToAdd,
            );
          }
        }

        context.break();
      }
    },
    { order: "bfs" },
  );

  if (targetComponent) {
    calculateGridSizes(targetComponent);
  }
};

export const removeComponentFromParent = (
  treeRoot: Component,
  id: string,
  parentId: string,
) => {
  let shouldRecalculate = false;
  let targetComponent = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id && context.parent?.id === parentId) {
        context.parent?.children?.splice(context.index, 1);
        shouldRecalculate = node.name === "GridColumn" || node.name === "Grid";
        targetComponent = context.parent;
        context.remove();
        context.break();
      }
    },
    { order: "bfs" },
  );

  if (shouldRecalculate && targetComponent) {
    calculateGridSizes(targetComponent);
  }
};

export const removeComponent = (treeRoot: Component, id: string) => {
  let shouldRecalculate = false;
  let targetComponent = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        context.parent?.children?.splice(context.index, 1);
        shouldRecalculate = node.name === "GridColumn" || node.name === "Grid";
        targetComponent = context.parent;
        context.remove();
        context.break();
      }
    },
    { order: "bfs" },
  );

  if (shouldRecalculate && targetComponent) {
    calculateGridSizes(targetComponent);
  }
};
