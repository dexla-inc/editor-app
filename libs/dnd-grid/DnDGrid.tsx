import { useEffect } from "react";
import Grid from "./components/Grid";
import { useEditorStore } from "./stores/editor";

export const DnDGrid = ({ components: propComponents, iframeWindow }: any) => {
  const components = useEditorStore((state) => state.components);

  useEffect(() => {
    if (propComponents) {
      useEditorStore.getState().setComponents(propComponents);
    }
  }, [propComponents]);

  useEffect(() => {
    useEditorStore.getState().setIframeWindow(iframeWindow);
  }, [iframeWindow]);

  return (
    <div style={{ background: "white", margin: "1rem" }}>
      <Grid components={components} />
    </div>
  );
};

export default DnDGrid;
