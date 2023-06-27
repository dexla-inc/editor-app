import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Container",
    description: "Table Container",
    props: {
      style: {
        marginTop: px(theme.spacing.xl),
        marginBottom: px(theme.spacing.xl),
        marginLeft: px(theme.spacing.xl),
        marginRight: px(theme.spacing.xl),
        width: "100%",
        height: "auto",
        minHeight: "100px",
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
