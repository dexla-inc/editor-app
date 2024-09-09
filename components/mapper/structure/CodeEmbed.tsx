import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

const htmlCode = `<!DOCTYPE html>
<html>
    <head>
        <!-- Add headers here -->
    </head>
    <body>
        <!-- Add content here -->
        <div>Embedded content here</div>
    </body>
</html>`;

export const jsonStructure = (props?: any): ComponentStructure => ({
  id: nanoid(),
  name: "CodeEmbed",
  description: "CodeEmbed",
  props: {
    ...requiredModifiers.codeEmbed,
    ...(props.props || {}),
  },
  onLoad: {
    htmlCode: { dataType: "static", static: htmlCode },
    cssCode: { dataType: "static", static: "/* Custom CSS here */" },
    jsCode: { dataType: "static", static: "// Custom JavaScript here" },
  },
  blockDroppingChildrenInside: true,
});
