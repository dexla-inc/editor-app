import { SidebarSection } from "@/components/SidebarSection";
import { useEditorStore } from "@/stores/editor";
import { Box, Center, Text } from "@mantine/core";
import { componentMapper } from "@/utils/componentMapper";
import { getComponentById } from "@/utils/editor";
import * as SpacingModifier from "@/components/modifiers/Spacing";
import * as TextModifier from "@/components/modifiers/Text";

type SectionsMapper = {
  [key: string]: any;
};

const sectionMapper: SectionsMapper = {
  spacing: SpacingModifier,
  text: TextModifier,
};

export const EditorAsideSections = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  if (!selectedComponentId) {
    return (
      <Box py="xl">
        <Center>
          <Text size="xs" color="dimmed" align="center">
            Select a component to edit
          </Text>
        </Center>
      </Box>
    );
  }

  const selectComponent = getComponentById(
    editorTree.root,
    selectedComponentId
  );
  const mappedComponent = componentMapper[selectComponent?.name as string];

  const sections = mappedComponent.modifiers.map((id) => {
    const modifier = sectionMapper[id as string];

    return {
      id: id,
      label: modifier.label,
      icon: modifier.icon,
      initiallyOpened: true,
      Component: modifier.Modifier,
    };
  });

  const sectionsToRender = sections.map(({ Component, ...item }) => (
    <SidebarSection {...item} key={item.label}>
      <Component />
    </SidebarSection>
  ));

  return <>{sectionsToRender}</>;
};
