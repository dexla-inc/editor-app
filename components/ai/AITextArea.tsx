import classes from "@/components/ai/AITextArea.module.css";
import { Icon } from "@/components/Icon";
import { AIRequestTypes } from "@/requests/ai/types";
import { useEditorStore } from "@/stores/editor";
import { Flex, Popover, Text } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Highlight, HighlightOptions } from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onTypeChange?: (type: AIRequestTypes) => void;
  items: AITextAreaItem[];
};

const FeatureHighlight = Highlight.extend<HighlightOptions>({
  name: "featureHighlight",
});

// const ActionHighlight = Highlight.extend<HighlightOptions>({
//   name: "actionHighlight",
// });

export const AITextArea = ({ value, onChange, onTypeChange, items }: Props) => {
  const [showFeatures, setFeature] = useState<boolean>(false);
  const theme = useEditorStore((state) => state.theme);

  const filteredItems = getFilteredItems(items, "");

  const editor = useEditor({
    extensions: [
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
        placeholder: "I want to ...",
      }),
    ],
    onUpdate: ({ editor }) => {
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

      const filteredFeatures = getFilteredItems(items, inputText);
      const isShowingFeatures =
        inputText.trim() === "" || filteredFeatures.length > 0;
      setFeature(isShowingFeatures);
      onChange(inputText);
    },
    onFocus: ({ editor }) => {
      const inputValue = editor.getText();
      const filtered = getFilteredItems(items, inputValue);
      setFeature(inputValue.trim() === "" || filtered.length > 0);
    },
  });

  return (
    <Popover
      opened={showFeatures}
      width={250}
      onClose={() => setFeature(false)}
    >
      <Popover.Target>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Content />
        </RichTextEditor>
      </Popover.Target>
      {showFeatures && (
        <Popover.Dropdown p={0}>
          {filteredItems.map((item) => (
            <Flex
              key={item.name}
              p="xs"
              gap={6}
              align="center"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.colors.gray[1],
                },
              }}
              onClick={() => {
                const newText = `${item.name} `;
                editor?.commands.setContent(newText, false);
                setFeature(false);
                onTypeChange && onTypeChange(item.type);
                applyHighlightIfMatched(
                  {
                    name: item.name,
                    type: item.type,
                    icon: item.icon,
                  },
                  "featureHighlight",
                  editor,
                  newText,
                );
              }}
            >
              <Icon name={item.icon} style={{ color: theme.colors.teal[6] }} />
              <Text>{item.name}</Text>
            </Flex>
          ))}
        </Popover.Dropdown>
      )}
    </Popover>
  );
};

const getFilteredItems = (featureItems: AITextAreaItem[], input: string) => {
  return featureItems.filter((item) =>
    item.name.toLowerCase().includes(input.toLowerCase()),
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
