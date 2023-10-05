import classes from "@/components/ai/AITextArea.module.css";
import { AIRequestTypes } from "@/requests/ai/types";
import { RichTextEditor } from "@mantine/tiptap";
import { Highlight, HighlightOptions } from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor, Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

type Props = {
  onChange: (value: string) => void;
  onTypeChange?: (type: AIRequestTypes) => void;
  items: AITextAreaItem[];
  placeholder: string;
};

const FeatureHighlight = Highlight.extend<HighlightOptions>({
  name: "featureHighlight",
});

// const ActionHighlight = Highlight.extend<HighlightOptions>({
//   name: "actionHighlight",
// });

export const AITextArea = ({
  onChange,
  onTypeChange,
  items,
  placeholder,
}: Props) => {
  //const [showFeatures, setFeature] = useState<boolean>(false);
  const [editor, setEditor] = useState<Editor>();

  const extensions = [
    StarterKit,
    FeatureHighlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: classes["feature-highlight"],
      },
    }),
    // ActionHighlight.configure({
    //   multicolor: true,
    //   HTMLAttributes: {
    //     class: classes["action-highlight"],
    //   },
    // }),
    Placeholder.configure({
      placeholder: placeholder,
    }),
  ] as Extensions;

  const editorProps = {
    attributes: {
      class: classes["rich-text-editor-content"],
    },
  } as any;

  const handleEditorUpdate = ({ editor }: { editor: any }) => {
    const inputText = editor.getText();
    clearPreviousHighlights(editor);

    const matchedFeatureItem = findMatchingItem(items, inputText);

    applyHighlightIfMatched(
      matchedFeatureItem,
      "featureHighlight",
      editor,
      inputText,
    );

    if (matchedFeatureItem && onTypeChange)
      onTypeChange(matchedFeatureItem.type);

    onChange(inputText);
  };

  useEffect(() => {
    const editor = new Editor({
      editorProps: editorProps,
      extensions: extensions,
      onUpdate: handleEditorUpdate,
    });
    setEditor(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder]);

  return (
    <RichTextEditor editor={editor as Editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export type AITextAreaItem = {
  name: string;
  icon: string;
  type: AIRequestTypes;
};

// const actionItems: AITextAreaItem[] = [
//   {
//     name: "Add",
//     icon: "IconPlus",
//   },
//   {
//     name: "Change",
//     icon: "IconEdit",
//   },
//   {
//     name: "Remove",
//     icon: "IconTrash",
//   },
// ];

// Clear previously set highlights
function clearPreviousHighlights(editor: any): void {
  //editor.commands.unsetMark("actionHighlight");
  editor.commands.unsetMark("featureHighlight");
}

// Find the item that matches the end of the input text
function findMatchingItem(items: any[], inputText: string): any | undefined {
  return items.find((item) => {
    const itemNameAtEnd = inputText.slice(-item.name.length).toLowerCase();
    return item.name.toLowerCase() === itemNameAtEnd;
  });
}

// Highlight matched item in the editor
function applyHighlightIfMatched(
  matchedItem: any | undefined,
  highlightType: string,
  editor: any,
  inputText: string,
): void {
  if (matchedItem) {
    const from = inputText.length - matchedItem.name.length;
    const to = inputText.length + 1;
    const currentTextInRange = inputText.slice(from, to - 1);

    if (currentTextInRange !== matchedItem.name) {
      const spaceBeforeName = from !== 0 ? " " : "";
      const textToInsert = spaceBeforeName + matchedItem.name;
      const highlightMark = editor.schema.marks[highlightType];

      const textNode = editor.state.schema.text(textToInsert);
      const transaction = editor.state.tr
        .replaceWith(from, to, textNode)
        .addMark(from + 1, to + 1, highlightMark.create());

      editor.view.dispatch(transaction);
    }
  }
}
