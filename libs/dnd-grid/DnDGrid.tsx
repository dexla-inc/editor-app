import { useEffect } from "react";
import Grid from "./components/Grid";
import { useEditorStore } from "./stores/editor";

export const DnDGrid = ({ components: propComponents, iframeWindow }: any) => {
  const { components } = useEditorStore();

  useEffect(() => {
    if (propComponents) {
      useEditorStore.setState({ components: propComponents });
    }
  }, [propComponents]);

  useEffect(() => {
    useEditorStore.setState({ iframeWindow });
  }, [iframeWindow]);

  return (
    <div style={{ background: "white", margin: "1rem" }}>
      <Grid components={components} />
    </div>
  );
};

export default DnDGrid;
