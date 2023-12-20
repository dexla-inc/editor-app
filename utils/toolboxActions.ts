import cloneDeep from "lodash.clonedeep";
import { addComponent } from "@/utils/editor";
import { structureMapper } from "@/utils/componentMapper";
import { useEditorStore } from "@/stores/editor";

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
