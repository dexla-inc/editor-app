import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): any => {
  const { value, textColor, color, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    blockDroppingChildrenInside: true,
    props: {
      bg: "bg-blue-500",
      textColor: "text-white",
      style: {
        gridColumn: "1/12",
        gridRow: "1/4",
      },
    },
  };
};
