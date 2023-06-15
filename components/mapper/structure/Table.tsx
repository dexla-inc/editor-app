import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Table",
    description: "Table",
    children: [],
    props: {
      striped: true,
      withBorder: true,
      withColumnBorders: true,
      data: [
        { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
        { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
        { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
        { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
        { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
      ],
      style: {
        width: "100%",
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
