import { jsonStructure as radioItemStructure } from "@/libs/dnd-flex/components/mapper/structure/RadioItem";
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
        width: "fit-content",
        height: "fit-content",
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
