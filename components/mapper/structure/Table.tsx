import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Container",
    description: "Table Container",
    props: {
      style: {
        width: "auto",
        height: "auto",
        minHeight: "auto",
        backgroundColor: "white",
      },
    },
    children: [
      {
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
          headers: { position: true, mass: true, symbol: true, name: true },
          config: { filter: false, sorting: false, pagination: false },
          style: {
            width: "100%",
          },
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
