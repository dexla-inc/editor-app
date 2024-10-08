import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Accordion",
    description: "Accordion",
    props: {
      defaultValue: "first",
      variant: "separated",
      icon: "IconPlus",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "AccordionItem",
        description: "Accordion Item",
        props: {
          value: "first",
          style: {
            width: "100%",
            height: "auto",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "AccordionControl",
            description: "Accordion Control",
            props: {
              style: {
                width: "100%",
                height: "auto",
                padding: "20px",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Container",
                props: {
                  style: {
                    alignItems: "center",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Accordion Text",
                    children: [],
                    props: {
                      children: "Lorem ipsum",
                      color: "dark",
                    },
                    blockDroppingChildrenInside: true,
                  },
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "AccordionPanel",
            description: "Accordion Panel",
            props: {
              style: {
                width: "100%",
                height: "auto",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Text",
                description: "Accordion Text",
                children: [],
                props: {
                  children:
                    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit, consequatur cupiditate expedita vero quas rerum eos voluptatem possimus, illo maiores quis! Tempora autem cum itaque dicta officiis vitae enim rerum magni in facilis ullam corporis sint praesentium, aspernatur sit doloremque? Suscipit veniam nobis corrupti, odio adipisci laborum neque! Rerum, amet.",
                  color: "Black.6",
                },
                blockDroppingChildrenInside: true,
              },
            ],
          },
        ],
      },
      {
        id: nanoid(),
        name: "AccordionItem",
        description: "Accordion Item",
        props: {
          value: "second",
          style: {
            width: "100%",
            height: "auto",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "AccordionControl",
            description: "Accordion Control",
            props: {
              style: {
                width: "100%",
                height: "auto",
                padding: "20px",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Container",
                props: {
                  style: {
                    alignItems: "center",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "Text",
                    description: "Accordion Text",
                    children: [],
                    props: {
                      children: "Dolor Sit",
                      color: "Black.6",
                    },
                    blockDroppingChildrenInside: true,
                  },
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "AccordionPanel",
            description: "Accordion Panel",
            props: {
              style: {
                width: "100%",
                height: "auto",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Text",
                description: "Accordion Text",
                children: [],
                props: {
                  children:
                    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit, consequatur cupiditate expedita vero quas rerum eos voluptatem possimus, illo maiores quis! Tempora autem cum itaque dicta officiis vitae enim rerum magni in facilis ullam corporis sint praesentium, aspernatur sit doloremque? Suscipit veniam nobis corrupti, odio adipisci laborum neque! Rerum, amet.",
                  color: "Black.6",
                },
                blockDroppingChildrenInside: true,
              },
            ],
          },
        ],
      },
    ],
  };
};
