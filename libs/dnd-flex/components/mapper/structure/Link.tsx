import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const content =
    props.props?.children ??
    props.props?.content ??
    props.props?.text ??
    props.props?.value ??
    "New link";

  const defaultValues = requiredModifiers.link;

  return {
    id: nanoid(),
    name: "Link",
    description: "Link",
    props: {
      children: content,
      ...defaultValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
