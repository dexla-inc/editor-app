import { useEffect } from "react";
import Grid from "./components/Grid";
import { useEditorStore } from "./stores/editor";

export const DnDGrid = ({ components: propComponents }: any) => {
  const { components } = useEditorStore();

  useEffect(() => {
    if (propComponents) {
      useEditorStore.setState({ components: propComponents });
    }
  }, [propComponents]);

  return (
    <div style={{ background: "white", margin: "1rem" }}>
      <Grid components={components} />
    </div>
  );
};

export default DnDGrid;
