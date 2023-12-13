import { createComponentEditorHandler } from "@/components/AIGenerationEditor";
import AIPromptTextareaInput from "@/components/AIPromptTextareaInput";
import { generateStructureFromScreenshot } from "@/requests/ai/queries";
import { useEditorStore } from "@/stores/editor";
import { THIN_GREEN_OUTLINE } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import { Component, DropTarget, getComponentById } from "@/utils/editor";
import {
  Flex,
  Popover,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { useRef, useState } from "react";

export default function AIPromptTextInput() {
  const internalTheme = useMantineTheme();
  const [description, setDescription] = useState<string>("");

  // start of handleComponentGeneration props

  const { editorTree, selectedComponentId } = useEditorStore((state) => ({
    editorTree: state.tree,
    selectedComponentId: state.selectedComponentId,
  }));

  let selectedComponent = null;
  if (selectedComponentId) {
    selectedComponent = getComponentById(editorTree.root, selectedComponentId);
  }

  const dropTarget = {
    id: selectedComponent?.id! ?? "content-wrapper",
    edge: "left",
  } as DropTarget;

  const componentBeingAddedId = useRef<string>();

  const { theme, updateTreeComponentChildren, tree, setTree, pages } =
    useEditorStore((state: any) => ({
      theme: state.theme,
      updateTreeComponentChildren: state.updateTreeComponentChildren,
      tree: state.tree,
      setTree: state.setTree,
      pages: state.pages,
      dropTarget,
    }));

  // end of handleComponentGeneration props

  const onClick = async (base64Image?: string) => {
    try {
      const result = await generateStructureFromScreenshot(
        description,
        theme,
        base64Image,
      );

      const applyComponentsIntoTree = createComponentEditorHandler({
        componentBeingAddedId,
        theme,
        updateTreeComponentChildren,
        tree,
        setTree,
        pages,
        dropTarget,
      });

      applyComponentsIntoTree(result.components as Component[]);
    } catch (error) {
      console.error(error);
    }
  };

  const resetState = () => {
    setDescription("");
  };

  return (
    <Popover
      width={500}
      position="bottom-start"
      withArrow
      shadow="md"
      onClose={resetState}
      withinPortal
    >
      <Popover.Target>
        <UnstyledButton
          placeholder="How can I help you?"
          w={250}
          p={6}
          sx={(theme) => ({
            borderRadius: theme.radius.sm,
            backgroundColor:
              theme.colorScheme === "dark" ? theme.black : theme.white,
            color: theme.colors.gray[9],
            fontSize: theme.fontSizes.sm,
            border: THIN_GREEN_OUTLINE,
            "&:hover": {
              outline: THIN_GREEN_OUTLINE,
            },
          })}
        >
          <Flex align="center" gap="xs">
            <IconSparkles
              size={ICON_SIZE}
              color={internalTheme.colors.teal[6]}
            />
            <Text color="grey" size="xs">
              How can I help you today?
            </Text>
          </Flex>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <AIPromptTextareaInput
          onClick={onClick}
          placeholder="Try something like 'Use the screenshot attached to build out a similar layout'"
          description={description}
          setDescription={setDescription}
          maxRows={8}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
