import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useInputValue } from "@/hooks/components/useInputValue";
import { EditableComponentMapper } from "@/utils/editor";
import {
  RichTextEditor as MantineRichTextEditor,
  RichTextEditorProps,
} from "@mantine/tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & RichTextEditorProps;

const TextEditorComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const { placeholder, value: computedValue } = component?.onLoad ?? {};
    const { triggers, bg, textColor, ...componentProps } =
      component.props as any;
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const [value, setValue] = useInputValue(
      {
        value: computedValue ?? "",
      },
      props.id!,
    );

    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder,
        }),
      ],
      content: value,
      onUpdate: ({ editor }) => {
        const value = editor.getText();
        setValue(value);
        triggers?.onChange?.({ target: { value } });
      },
    });

    // const insertVariable = () => {
    //   if (editor) {
    //     editor.chain().focus().insertContent("{{variable}}").run();
    //   }
    // };

    const controlStyles = {
      border: "none",
      backgroundColor,
      color,
    };

    const toolbarHeight =
      editor?.view?.dom?.querySelector(".mantine-MantineRichTextEditor-toolbar")
        ?.clientHeight ?? 46;

    return (
      <MantineRichTextEditor
        itemRef={ref as any}
        {...props}
        editor={editor}
        {...componentProps}
        {...triggers}
        styles={{
          content: {
            width: "100%",
            height: `calc(100% - ${toolbarHeight}px)`,
            backgroundColor: "transparent",
            color,
          },
          toolbar: { backgroundColor: "transparent", border: "none" },
          root: { backgroundColor },
        }}
      >
        <MantineRichTextEditor.Content />
        <MantineRichTextEditor.Toolbar sticky stickyOffset={60}>
          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Bold style={controlStyles} />
            <MantineRichTextEditor.Italic style={controlStyles} />
            <MantineRichTextEditor.BulletList style={controlStyles} />
          </MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.ControlsGroup>
            {/* <MantineRichTextEditor.Control
              onClick={insertVariable}
              style={controlStyles}
            >
              Add variable
            </MantineRichTextEditor.Control> */}
          </MantineRichTextEditor.ControlsGroup>
        </MantineRichTextEditor.Toolbar>
      </MantineRichTextEditor>
    );
  },
);

export const TextEditor = memo(
  withComponentWrapper<Props>(TextEditorComponent),
);
