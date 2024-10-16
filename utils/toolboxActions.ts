import { jsonStructure as accordionItemSchema } from "@/libs/dnd-flex/components/mapper/structure/AccordionItem";
import { jsonStructure as tabSchema } from "@/libs/dnd-flex/components/mapper/structure/Tab";
import { jsonStructure as tabsPanelSchema } from "@/libs/dnd-flex/components/mapper/structure/TabsPanel";
import { useEditorTreeStore } from "@/stores/editorTree";
import { structureMapper } from "@/libs/dnd-flex/utils/componentMapper";
import {
  Component,
  ComponentStructure,
  EditorTreeCopy,
  addComponent,
} from "@/utils/editor";

export const addColumnToolboxAction = ({ component }: any) => {
  const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
  const setEditorTree = useEditorTreeStore.getState().setTree;

  const ColumnSchema = structureMapper["GridColumn"].structure({});

  addComponent(
    editorTree.root,
    {
      ...ColumnSchema,
      props: { ...ColumnSchema.props, resetTargetResized: true },
    },
    {
      id: component.id!,
      edge: "center",
    },
  );

  setEditorTree(editorTree);
};

export const insertRowToolboxAction = ({ parent }: any) => {
  const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
  const setEditorTree = useEditorTreeStore.getState().setTree;

  const ColumnSchema = structureMapper["GridColumn"].structure({});
  const GridSchema = structureMapper["Grid"].structure({});

  addComponent(
    editorTree.root,
    { ...GridSchema, children: [ColumnSchema] },
    {
      id: parent?.id!,
      edge: "center",
    },
  );

  setEditorTree(editorTree);
};

export const addColumnToParentToolboxAction = ({ parent }: any) => {
  const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
  const setEditorTree = useEditorTreeStore.getState().setTree;

  const ColumnSchema = structureMapper["GridColumn"].structure({});

  addComponent(
    editorTree.root,
    {
      ...ColumnSchema,
      props: { ...ColumnSchema.props, resetTargetResized: true },
    },
    {
      id: parent.id!,
      edge: "center",
    },
  );

  setEditorTree(editorTree);
};

export const insertGridToolboxAction = ({ component }: any) => {
  const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
  const setEditorTree = useEditorTreeStore.getState().setTree;

  const GridSchema = structureMapper["Grid"].structure({});

  addComponent(editorTree.root, GridSchema, {
    id: component.id!,
    edge: "center",
  });

  setEditorTree(editorTree);
};

export const addAccordionItemToolboxAction = ({ component }: any) => {
  const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
  const setEditorTree = useEditorTreeStore.getState().setTree;

  addComponent(editorTree.root, accordionItemSchema({}), {
    id: component.id!,
    edge: "center",
  });

  setEditorTree(editorTree);
};

export const addTabToolboxAction = ({ component }: any) => {
  const editorTree = useEditorTreeStore.getState().tree;
  const setEditorTree = useEditorTreeStore.getState().setTree;

  const tabList = component.children.find(
    (child: Component) => child.name === "TabsList",
  );

  addComponent(
    editorTree.root as ComponentStructure,
    tabsPanelSchema({ props: { value: "new-tab" } }),
    {
      id: component.id!,
      edge: "center",
    },
  );

  addComponent(
    editorTree.root as ComponentStructure,
    tabSchema({ props: { value: "new-tab" } }),
    {
      id: tabList.id!,
      edge: "center",
    },
  );

  setEditorTree(editorTree as EditorTreeCopy);
};
