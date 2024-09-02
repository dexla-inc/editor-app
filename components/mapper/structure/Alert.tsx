import { structureMapper } from "@/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const title = structureMapper["Title"].structure({});
  const text = structureMapper["Text"].structure({});

  return {
    id: nanoid(),
    name: "Alert",
    description: "Alert",
    children: [
      {
        ...title,
        id: nanoid(),
        props: {
          children: "Alert title",
          order: 6,
        },
      },
      {
        ...text,
        id: nanoid(),
        props: {
          children: "Alert text",
        },
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
      ...(props.props || {}),
    },
  };
};
