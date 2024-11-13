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
              gridColumn: "2/17",
              gridRow: "1/5",
            },
          },
        ),
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Text",
        description: "Alert Description",
        children: [],
        props: {
          children: "This is your Alert Description",
          color: "Black.6",
          order: 1,
          style: {
            width: "auto",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "1 / 30",
            gridRow: "6 / 9",
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
      color: "Danger.2",
      iconColor: "Danger.6",
    },
  };
};
