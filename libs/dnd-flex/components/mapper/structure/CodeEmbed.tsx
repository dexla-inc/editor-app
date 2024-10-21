import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

const htmlCode = `<!DOCTYPE html>
<html>
  <head>
    <!-- Add headers here -->
    <style>
        /* Add styles here */
    </style>
  </head>
  <body>
    <!-- Add content here -->
    <div>Embedded content here</div>
    <script>
      // Add custom scripts below
    </script>
  </body>
</html>`;

export const jsonStructure = (props?: any): ComponentStructure => ({
  id: nanoid(),
  name: "CodeEmbed",
  description: "CodeEmbed",
  props: {
    style: {
      ...requiredModifiers.codeEmbed,
      display: "block",
      height: "auto",
      width: "100%",
    },
    ...(props.props || {}),
  },
  onLoad: {
    htmlCode: { dataType: "static", static: htmlCode },
  },
  blockDroppingChildrenInside: true,
});
