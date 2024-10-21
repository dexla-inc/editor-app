import { ComponentType, Suspense } from "react";
import { withComponentVisibility } from "@/hoc/withComponentVisibility";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useGridStyling } from "@/libs/dnd-grid/hooks/useGridStyling";
import { useEditorDroppableEvents } from "@/hooks/components/useEditorDroppableEvents";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { ResizeHandlers } from "@/libs/dnd-grid/components/ResizeHandlers";

export const withDnd = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentWrapper = (props: any) => {
    const cssType = useEditorTreeStore((state) => state.cssType);

    return (
      <Suspense fallback={<></>}>
        {cssType === "FLEX" ? (
          <FlexComponent Component={Component} props={props} />
        ) : (
          <GridComponent Component={Component} props={props} />
        )}
      </Suspense>
    );
  };

  return withComponentVisibility(ComponentWrapper);
};

const FlexComponent = ({
  Component,
  props,
}: {
  Component: ComponentType<any>;
  props: any;
}) => {
  const { droppable: flexDnd } = useEditorDroppableEvents({
    componentId: props.component.id!,
  });
  const ChildrenWrapper = () => <></>;

  return (
    <Component {...props} {...flexDnd} ChildrenWrapper={ChildrenWrapper} />
  );
};

const GridComponent = ({
  Component,
  props,
}: {
  Component: ComponentType<any>;
  props: any;
}) => {
  const gridDnd = useDnd();
  const gridStyling = useGridStyling({ component: props.component });

  const ChildrenWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
      <ResizeHandlers componentId={props.component.id} />
    </div>
  );

  return (
    <Component
      {...props}
      {...gridDnd}
      ChildrenWrapper={ChildrenWrapper}
      style={gridStyling}
    />
  );
};
