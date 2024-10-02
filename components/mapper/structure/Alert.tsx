import { defaultTheme } from "@/utils/branding";
import { structureMapper } from "@/libs/dnd-flex/utils/componentMapper";
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
            marginBottom: "8px",
          },
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
        width: "100%",
        height: "auto",
        padding: "18px",
      },
      icon: "IconAlertCircle",
      color: "Danger.6",
      iconColor: "Danger.6",
      ...(props.props || {}),
    },
  };
};
