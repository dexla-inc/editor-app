import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";
import merge from "lodash.merge";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Alert",
    description: "Alert",
    children: [
      {
        id: nanoid(),
        name: "Title",
        description: "Title",
        children: [],
        props: merge(
          {},
          {
            children: "New Title",
            color: "Black.6",
            order: 1,
            style: {
              width: "auto",
              height: "auto",
              display: "grid",
              gridTemplateColumns: "subgrid",
              gridTemplateRows: "subgrid",
              gridColumn: "1/7",
              gridRow: "1/5",
            },
          },
        ),
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Title",
        description: "Title",
        children: [],
        props: {
          children: "New Title",
          color: "Black.6",
          order: 1,
          style: {
            width: "auto",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "8 / 16",
            gridRow: "1 / 5",
          },
        },
        blockDroppingChildrenInside: true,
      },
    ],
    props: {
      style: {
        width: "auto",
        height: "auto",
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridTemplateRows: "subgrid",
        gridColumn: "1 / 40",
        gridRow: "1 / 10",
      },
      icon: "IconAlertCircle",
      color: "Danger.6",
      iconColor: "Danger.6",
    },
  };
};
