import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "auto"
  }`;

  return {
    id: nanoid(),
    name: "Container",
    description: "NotImplement Container",
    props: {
      w: columnsToWidth,
    },
    children: [
      {
        id: nanoid(),
        name: "Stack",
        description: "NotImplement Stack",
        props: {
          w: "100%",
          align: "center",
          justify: "center",
          spacing: 2,
          py: "lg",
          ...(props.props || {}),
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "NotImplement Component Name",
            children: [],
            props: {
              children: props.name,
              size: "sm",
              w: "auto",
            },
          },
          {
            id: nanoid(),
            name: "Text",
            description: "NotImplement Text",
            children: [],
            props: {
              children: "Not implemented yet",
              size: "xs",
              color: "dimmed",
              w: "auto",
            },
          },
        ],
      },
    ],
  };
};
