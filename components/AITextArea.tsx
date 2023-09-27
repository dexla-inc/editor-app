import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { Flex, Popover, Text } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

const getFilteredItems = (featureItems: FeatureItem[], input: string) => {
  return featureItems.filter((item) =>
    item.name.toLowerCase().includes(input.toLowerCase()),
  );
};

type FeatureItem = {
  name: string;
  icon: string;
};

const items: FeatureItem[] = [
  {
    name: "API",
    icon: "IconDatabase",
  },
  {
    name: "Components",
    icon: "IconComponents",
  },
  {
    name: "Layout",
    icon: "IconLayout",
  },
  {
    name: "Page",
    icon: "IconFileDescription",
  },
];

export const AITextarea = () => {
  const [showFeatures, setFeature] = useState<boolean>(false);
  const theme = useEditorStore((state) => state.theme);

  const filteredItems = getFilteredItems(items, "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: "I want to Add / Change / Remove...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const inputText = editor.getText();

      let featureNameLength = 0;

      const hasMatch = items.find((item) => {
        featureNameLength = item.name.length;
        const endSubstringOfInput = inputText
          .slice(-featureNameLength)
          .toLowerCase();
        return item.name.toLowerCase() === endSubstringOfInput;
      });

      if (hasMatch) {
        const highlightedContent = `${inputText.substring(
          0,
          inputText.length - featureNameLength,
        )}<mark style="background-color: #12b886;">${hasMatch.name}</mark>`;

        editor.commands.setContent(highlightedContent);
      }

      editor.commands.unsetMark("highlight");

      const filtered = getFilteredItems(items, inputText);

      setFeature(inputText.trim() === "" || filtered.length > 0);
    },
    onBlur: ({ editor }) => {
      const inputValue = editor.getText();
      const filtered = getFilteredItems(items, inputValue);
      setFeature(inputValue.trim() === "" || filtered.length > 0);
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
                editor?.commands.setContent(`${item.name} `, false);
                setFeature(false);
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
