import { defaultTheme } from "@/utils/branding";
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
          style: {
            gridColumn: "1 / 15",
            gridRow: "1 / 5",
          },
        },
      },
      {
        ...text,
        id: nanoid(),
        props: {
          children: "Alert text",
          style: {
            gridColumn: "1 / 15",
            gridRow: "5 / 10",
          },
        },
      },
    ],
    props: {
      style: {
        width: "100%",
        height: "auto",
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridTemplateRows: "subgrid",
        gridColumn: "1 / 15",
        gridRow: "1 / 10",
      },
      icon: "IconAlertCircle",
      color: "Danger.6",
      iconColor: "Danger.6",
      ...(props.props || {}),
    },
  };
};
