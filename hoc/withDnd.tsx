import { ComponentType, Suspense } from "react";
import { withComponentVisibility } from "@/hoc/withComponentVisibility";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useGridStyling } from "@/libs/dnd-grid/hooks/useGridStyling";
import { useEditorDroppableEvents } from "@/hooks/components/useEditorDroppableEvents";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { ResizeHandlers } from "@/libs/dnd-grid/components/ResizeHandlers";
import { isPreviewModeSelector } from "@/utils/componentSelectors";

export const withDnd = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentWrapper = (props: any) => {
    const cssType = useEditorTreeStore((state) => state.cssType);
    const isGridCss = cssType === "GRID";

    const customProps = { ...props, grid: { isGridCss } };

    return (
      <Suspense fallback={<></>}>
        {cssType === "FLEX" ? (
          <FlexComponent Component={Component} props={customProps} />
        ) : (
          <GridComponent Component={Component} props={customProps} />
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
  const ChildrenWrapper = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  return (
    <Component
      {...props}
      {...flexDnd}
      grid={{ ...props.grid, ChildrenWrapper }}
    />
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
  const isPreviewMode = useEditorTreeStore(isPreviewModeSelector);

  const ChildrenWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isPreviewMode) {
      return <>{children}</>;
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          gridArea: "1 / 1 / -1 / -1",
        }}
      >
        {children}
        <ResizeHandlers componentId={props.component.id} />
      </div>
    );
  };

  return (
    <Component
      {...props}
      {...gridDnd}
      grid={{ ...props.grid, ChildrenWrapper }}
      style={gridStyling}
    />
  );
};
