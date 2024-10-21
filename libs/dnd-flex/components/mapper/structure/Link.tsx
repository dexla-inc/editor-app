import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import merge from "lodash.merge";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const content =
    props.props?.children ??
    props.props?.content ??
    props.props?.text ??
    props.props?.value ??
    "New link";

  const combinedProps = merge({}, requiredModifiers.link, props.props, {
    children: content,
    style: {
      width: "fit-content",
      height: "fit-content",
    },
  });

  return {
    id: nanoid(),
    name: "Link",
    description: "Link",
    props: combinedProps,
    blockDroppingChildrenInside: true,
  };
};
