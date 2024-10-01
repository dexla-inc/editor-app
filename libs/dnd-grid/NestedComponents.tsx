import { MantineProvider } from "@mantine/core";
import ComponentList from "./components/ComponentList";
import ComponentToolbox from "./components/ComponentToolbox";
import ErrorBoundary from "./components/ErrorBoundary";
import Grid from "./components/Grid";

export const NestedComponents = ({ components }: any) => {
  return (
    <ErrorBoundary>
      <MantineProvider>
        <div style={{ padding: "10px" }}>
          <ComponentToolbox />
          <ComponentList />
          <Grid components={components} />
        </div>
      </MantineProvider>
    </ErrorBoundary>
  );
};
