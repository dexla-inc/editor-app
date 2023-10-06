import { CSSProperties } from "react";
import { PageResponse } from "@/requests/pages/types";
import {
  MantineThemeExtended,
  emptyEditorTree,
  useEditorStore,
} from "@/stores/editor";
import { Action } from "@/utils/actions";
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
  id: string,
  props: any,
  state: string = "default",
  language: string = "default",
) => {
  const translatableFields = pickBy(props, pickTranslatableFields);
  const styleFields = pickBy(props, pickStyleFields);
  const alwaysDefaultFields = omit(props, [
    ...translatableFieldsKeys,
    ...styleFieldsKeys,
  ]);

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        if (language === "default") {
          node.props = merge(node.props, translatableFields);
        } else {
          node.languages = merge(node.languages, {
            [language]: translatableFields,
          });
        }

        if (state === "default") {
          node.props = merge(node.props, styleFields, alwaysDefaultFields);
        } else {
          node.states = merge(node.states, {
            [state]: styleFields,
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
