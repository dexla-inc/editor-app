import { PageResponse } from "@/requests/pages/types";
import {
  MantineThemeExtended,
  emptyEditorTree,
  useEditorStore,
} from "@/stores/editor";
import {
  Action,
  ChangeStepAction,
  ChangeStepActionParams,
} from "@/utils/actions";
import { structureMapper } from "@/utils/componentMapper";
import { templatesMapper } from "@/utils/templatesMapper";
import cloneDeep from "lodash.clonedeep";
import debounce from "lodash.debounce";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import pickBy from "lodash.pickby";
import { nanoid } from "nanoid";
import { omit } from "next/dist/shared/lib/router/utils/omit";
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

export const getAllActions = (treeRoot: Component): Action[] => {
  const actions: Action[] = [];

  crawl(
    treeRoot,
    (node) => {
      if ((node.actions?.length ?? 0) > 0) {
        actions.push(...(node.actions ?? []));
      }
    },
    { order: "bfs" },
  );

  return actions;
};

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
    (node, context) => {
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
              minHeight: "50px",
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
                  padding: "20px",
                  backgroundColor: "White.0",
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

export const getNewComponents = (
  tree: { rows: Row[] },
  theme: MantineThemeExtended,
  pages: PageResponse[],
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
            padding: "20px",
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

export const addRowsToExistingTree = (
  rows: Row[],
  existingTree: EditorTree,
) => {
  // Traverse the rows to get the components
  const newComponents: Component[] = rows.flatMap((row: Row) => row.components);

  // Combine the new components with the existing tree's root children
  const combinedChildren: Component[] = [
    ...(existingTree.root.children || []),
    ...newComponents,
  ];

  // Return a new editor tree with the combined children
  const editorTree: EditorTree = {
    name: "Initial State",
    timestamp: Date.now(),
    root: {
      ...existingTree.root,
      children: combinedChildren,
    },
  };

  return editorTree;
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

const translatableFields = [
  "children",
  "label",
  "title",
  "alt",
  "placeholder",
  "data",
  "tooltip",
];

const pickTranslatableFields = (value: string, key: string) => {
  return value !== "" && translatableFields.includes(key);
};

export const updateTreeComponent = (
  treeRoot: Component,
  id: string,
  props: any,
  state: string = "default",
  language: string = "default",
) => {
  const textFields = pickBy(props, pickTranslatableFields);
  const stylingFields = omit(props, translatableFields);

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        if (language === "default") {
          node.props = merge(node.props, textFields);
        } else {
          node.languages = merge(node.languages, {
            [language]: textFields,
          });
        }

        if (state === "default") {
          node.props = merge(node.props, stylingFields);
        } else {
          node.states = merge(node.states, {
            [state]: stylingFields,
          });
        }

        context.break();
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

export const resetAllData = (treeRoot: Component) => {
  crawl(
    treeRoot,
    (node) => {
      if (node.props?.data) {
        node.props.data = undefined;
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

const checkIfIsChildDeep = (treeRoot: Component, childId: string): boolean => {
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

export const moveComponentToDifferentParent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget,
  newParentId: string,
) => {
  const _componentToAdd = getComponentById(treeRoot, id) as Component;
  const componentToAdd = cloneDeep(_componentToAdd);
  replaceIdsDeeply(componentToAdd);

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === newParentId) {
        if (dropTarget.edge === "left" || dropTarget.edge === "top") {
          const dropIndex = node.children?.findIndex(
            (c) => c.id === dropTarget.id,
          );
          node.children?.splice(Math.max(dropIndex || 0, 0), 0, componentToAdd);
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

        context.break();
      }
    },
    { order: "bfs" },
  );
};

export const moveComponent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget,
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        const parent = context.parent;
        const items = (parent?.children?.map((c) => c.id) ?? []) as string[];
        const oldIndex = items.indexOf(id);
        let newIndex = items.indexOf(dropTarget.id);

        if (["top", "left"].includes(dropTarget.edge) && oldIndex < newIndex) {
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

        context.break();
      }
    },
    { order: "bfs" },
  );
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
  componentName: string,
): Component[] => {
  const components: Component[] = [];

  crawl(
    treeRoot,
    (node) => {
      if (node.name === componentName) {
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

export const removeComponentFromParent = (
  treeRoot: Component,
  id: string,
  parentId: string,
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id && context.parent?.id === parentId) {
        context.parent?.children?.splice(context.index, 1);
        context.remove();
        context.break();
      }
    },
    { order: "bfs" },
  );
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

export const removeComponent = (treeRoot: Component, id: string) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        if (node.props?.fixedPosition) {
          resetContentWrapperWidth(treeRoot);
        }
        context.parent?.children?.splice(context.index, 1);
        context.remove();
        context.break();
      }
    },
    { order: "bfs" },
  );
};

export const getComponentIndex = (parent: Component, id: string) => {
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

  crawl(
    treeRoot,
    (node, context) => {
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
            } else if (
              ["right", "bottom", "center"].includes(dropTarget.edge)
            ) {
              const index = dropIndex ?? context.index + 1;
              node.children.splice(index, 0, copy);
            }
          }

          context.break();
        }
      }
    },
    { order: "bfs" },
  );

  return copy.id as string;
};

export type ComponentRect = {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  x: number;
  y: number;
};

export function leftOfRectangle(
  rect: DOMRect,
  left = rect.left,
  top = rect.top,
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = left;
  newRect.y = top + newRect.height * 0.5;
  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export function rightOfRectangle(
  rect: DOMRect,
  right = rect.right,
  top = rect.top,
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = right;
  newRect.y = top + newRect.height * 0.5;
  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export function topOfRectangle(
  rect: DOMRect,
  left = rect.left,
  top = rect.top,
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = left + newRect.width * 0.5;
  newRect.y = top;
  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export function bottomOfRectangle(
  rect: DOMRect,
  left = rect.left,
  bottom = rect.bottom,
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = left + newRect.width * 0.5;
  newRect.y = bottom;
  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export function centerOfRectangle(
  rect: DOMRect,
  left = rect.left,
  top = rect.top,
): DOMRect {
  const newRect = rect.toJSON();
  newRect.x = left + newRect.width * 0.5;
  newRect.y = top + newRect.height * 0.5;

  return new DOMRect(newRect.x, newRect.y, newRect.width, newRect.height);
}

export type Edge = "left" | "right" | "top" | "bottom" | "center";

export function distanceBetween(p1: DOMRect, p2: DOMRect) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

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
  (value: Component[]) => {
    const updateTreeComponentChildren =
      useEditorStore.getState().updateTreeComponentChildren;
    const selectedComponentId = useEditorStore.getState().selectedComponentId;
    updateTreeComponentChildren(selectedComponentId as string, value);
  },
  300,
);

export const debouncedTreeComponentPropsUpdate = debounce(
  (field: string, value: any) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    const selectedComponentId = useEditorStore.getState().selectedComponentId;
    updateTreeComponent(selectedComponentId as string, {
      [field]: value,
    });
  },
  300,
);

export const debouncedTreeComponentStyleUpdate = debounce(
  (field: string, value: any) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    const selectedComponentId = useEditorStore.getState().selectedComponentId;
    updateTreeComponent(selectedComponentId as string, {
      style: { [field]: value },
    });
  },
  300,
);

export const debouncedTreeUpdate = debounce((...params: any[]) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  // @ts-ignore
  updateTreeComponent(...params);
}, 300);
