import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => ({
  id: nanoid(),
  name: "CodeEmbed",
  description: "CodeEmbed",
  props: {
    htmlCode: "<div>Custom HTML here</div>",
    cssCode: "/* Custom CSS here */",
    jsCode: "// Custom JavaScript here",
    ...(props.props || {}),
  },
  blockDroppingChildrenInside: true,
});
