import { jsonStructure as radioItemStructure } from "@/libs/dnd-grid/components/mapper/structure/RadioItem";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const radioGroupId = nanoid();

  const radioItemOne = radioItemStructure({
    title: "Basic",
    content: "For smaller businesses, with simple salaries and pay schedules.",
    props: { value: "change-me-1" },
  });
  const radioItemTwo = radioItemStructure({
    title: "Complete",
    content:
      "For growing business who wants to create a rewarding place to work.",
    props: { value: "change-me-2" },
  });

  return {
    id: radioGroupId,
    name: "Radio",
    description: "Radio Group",
    props: {
      name: radioGroupId,
      style: {
        gridColumn: "1/30",
        gridRow: "1/10",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        ...radioItemOne,
      },
      {
        id: nanoid(),
        ...radioItemTwo,
      },
    ],
  };
};
