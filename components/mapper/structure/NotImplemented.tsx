import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => ({
  id: nanoid(),
  name: "Container",
  columns: props.columns || 12,
  description: "NotImplement Root",
  children: [
    {
      id: nanoid(),
      name: "Flex",
      description: "NotImplement Wrapper Flex",
      columns: 12,
      props: {
        w: "100%",
        h: "100%",
        justify: "center",
        align: "center",
      },
      children: [
        {
          id: nanoid(),
          name: "Stack",
          columns: 12,
          description: "NotImplement Stack",
          props: {
            w: "100%",
            align: "center",
            justify: "center",
            spacing: 2,
            py: "lg",
          },
          children: [
            {
              id: nanoid(),
              name: "Text",
              columns: 0,
              description: "NotImplement Component Name",
              children: [],
              props: {
                children: props.name,
                size: "sm",
              },
            },
            {
              id: nanoid(),
              name: "Text",
              columns: 0,
              description: "NotImplement Text",
              children: [],
              props: {
                children: "Not implemented yet",
                size: "xs",
                color: "dimmed",
              },
            },
          ],
        },
      ],
    },
  ],
});
