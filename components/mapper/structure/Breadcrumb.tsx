import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "auto"
  }`;

  return {
    id: nanoid(),
    name: "Breadcrumb",
    description: "Breadcrumb",
    props: {
      style: {
        width: columnsToWidth,
        height: "auto",
      },
      separator: "•",
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        props: {
          children: "Home",
          color: "Black.6",
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        props: {
          children: "Settings",
          color: "Black.6",
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        props: {
          children: "About",
          color: "Black.6",
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
