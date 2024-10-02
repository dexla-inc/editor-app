import { MantineProvider } from "@mantine/core";
import ComponentList from "./components/ComponentList";
import ComponentToolbox from "./components/ComponentToolbox";
import ErrorBoundary from "./components/ErrorBoundary";
import DnDGrid from "./DnDGrid";

export const NestedComponents = ({ components }: any) => {
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
