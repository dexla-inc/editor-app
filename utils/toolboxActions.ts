import cloneDeep from "lodash.clonedeep";
import { Component, addComponent } from "@/utils/editor";
import { structureMapper } from "@/utils/componentMapper";
import { useEditorStore } from "@/stores/editor";
import { jsonStructure as accordionItemSchema } from "@/components/mapper/structure/AccordionItem";
import { jsonStructure as tabsPanelSchema } from "@/components/mapper/structure/TabsPanel";
import { jsonStructure as tabSchema } from "@/components/mapper/structure/Tab";

export const addColumnToolboxAction = ({ component }: any) => {
  const editorTree = useEditorStore.getState().tree;
  const setEditorTree = useEditorStore.getState().setTree;

  const copy = cloneDeep(editorTree);
  const ColumnSchema = structureMapper["GridColumn"].structure({});

  addComponent(
    copy.root,
    {
      ...ColumnSchema,
      props: { ...ColumnSchema.props, resetTargetResized: true },
    },
    {
      id: component.id!,
      edge: "center",
    },
  );

  setEditorTree(copy);
};

export const insertRowToolboxAction = ({ parent }: any) => {
  const editorTree = useEditorStore.getState().tree;
  const setEditorTree = useEditorStore.getState().setTree;

  const copy = cloneDeep(editorTree);
  const ColumnSchema = structureMapper["GridColumn"].structure({});
  const GridSchema = structureMapper["Grid"].structure({});

  addComponent(
    copy.root,
    { ...GridSchema, children: [ColumnSchema] },
    {
      id: parent?.id!,
      edge: "center",
    },
  );

  setEditorTree(copy);
};

export const addColumnToParentToolboxAction = ({ parent }: any) => {
  const editorTree = useEditorStore.getState().tree;
  const setEditorTree = useEditorStore.getState().setTree;

  const copy = cloneDeep(editorTree);
  const ColumnSchema = structureMapper["GridColumn"].structure({});

  addComponent(
    copy.root,
    {
      ...ColumnSchema,
      props: { ...ColumnSchema.props, resetTargetResized: true },
    },
    {
      id: parent.id!,
      edge: "center",
    },
  );

  setEditorTree(copy);
};

export const insertGridToolboxAction = ({ component }: any) => {
  const editorTree = useEditorStore.getState().tree;
  const setEditorTree = useEditorStore.getState().setTree;

  const copy = cloneDeep(editorTree);
  const GridSchema = structureMapper["Grid"].structure({});

  addComponent(copy.root, GridSchema, {
    id: component.id!,
    edge: "center",
  });

  setEditorTree(copy);
};

export const addAccordionItemToolboxAction = ({ component }: any) => {
  const editorTree = useEditorStore.getState().tree;
  const setEditorTree = useEditorStore.getState().setTree;

  const copy = cloneDeep(editorTree);

  addComponent(copy.root, accordionItemSchema({}), {
    id: component.id!,
    edge: "center",
  });

  setEditorTree(copy);
};

export const addTabToolboxAction = ({ component }: any) => {
  const editorTree = useEditorStore.getState().tree;
  const setEditorTree = useEditorStore.getState().setTree;

  const tabList = component.children.find(
    (child: Component) => child.name === "TabsList",
  );

  const copy = cloneDeep(editorTree);

  addComponent(copy.root, tabsPanelSchema({ props: { value: "new-tab" } }), {
    id: component.id!,
    edge: "center",
  });

  addComponent(copy.root, tabSchema({ props: { value: "new-tab" } }), {
    id: tabList.id!,
    edge: "center",
  });

  setEditorTree(copy);
};
