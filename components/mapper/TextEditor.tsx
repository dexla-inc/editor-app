import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, Button } from "@mantine/core";
import { RichTextEditor, RichTextEditorProps } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & RichTextEditorProps;

const TextEditorComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const editor = useEditor({
      extensions: [StarterKit],
      content: "",
    });

    const insertVariable = () => {
      if (editor) {
        editor.chain().focus().insertContent("{{variable}}").run();
      }
    };

    return (
      <Box
        {...props}
        {...component?.props}
        style={{ width: "100%", height: "300px" }}
      >
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar></RichTextEditor.Toolbar>
        </RichTextEditor>

        <Button
          onClick={insertVariable}
          variant="subtle"
          style={{ marginTop: 8 }}
        >
          Add variable
        </Button>
      </Box>
    );
  },
);

TextEditorComponent.displayName = "TextEditor";

export const TextEditor = memo(
  withComponentWrapper<Props>(TextEditorComponent),
);
