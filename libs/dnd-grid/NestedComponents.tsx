import { MantineProvider } from "@mantine/core";
import ComponentList from "@/libs/dnd-grid/components/ComponentList";
import ComponentToolbox from "@/libs/dnd-grid/components/ComponentToolbox";
import ErrorBoundary from "@/libs/dnd-grid/components/ErrorBoundary";
import DnDGrid from "@/libs/dnd-grid/DnDGrid";

export const NestedComponents = ({ components, iframeWindow }: any) => {
  return (
    <ErrorBoundary>
      <MantineProvider>
        <div style={{ padding: "10px" }}>
          <ComponentToolbox />
          <ComponentList />
          <DnDGrid components={components} />
        </div>
      </MantineProvider>
    </ErrorBoundary>
  );
};
