import { Grid } from "@mantine/core";
import React from "react";

interface Props {
  id: string;
  Draggable: React.ComponentType<any>; // Adjust the type as necessary to be more specific if possible
}

// Define the component as a functional component
const GridItemComponent: React.FC<Props> = ({ id, Draggable }) => {
  return (
    <Grid.Col span={6} key={id}>
      <Draggable />
    </Grid.Col>
  );
};

// Optional: Set a displayName for debugging purposes
GridItemComponent.displayName = "GridItemComponent";

export default GridItemComponent;
