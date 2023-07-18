import { SidebarSection } from "@/components/SidebarSection";
import * as BackgroundModifier from "@/components/modifiers/Background";
import * as BorderModifier from "@/components/modifiers/Border";
import * as ButtonModifier from "@/components/modifiers/Button";
import * as InputModifier from "@/components/modifiers/Input";
import * as LayoutModifier from "@/components/modifiers/Layout";
import * as SizeModifier from "@/components/modifiers/Size";
import * as SpacingModifier from "@/components/modifiers/Spacing";
import * as TextModifier from "@/components/modifiers/Text";
import * as TitleModifier from "@/components/modifiers/Title";
import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { getComponentById } from "@/utils/editor";
import { Box, Center, Text } from "@mantine/core";

type SectionsMapper = {
  [key: string]: any;
};

const sectionMapper: SectionsMapper = {
  spacing: SpacingModifier,
  size: SizeModifier,
  text: TextModifier,
  border: BorderModifier,
  layout: LayoutModifier,
  background: BackgroundModifier,
  input: InputModifier,
  button: ButtonModifier,
  title: TitleModifier,
};

export const EditorAsideSections = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const isContentWrapperSelected = selectedComponentId === "content-wrapper";

  if (!selectedComponentId || isContentWrapperSelected) {
    return (
      <Box py="xl">
        <Center>
          <Text size="xs" color="dimmed" align="center">
            You are unable to edit this Content Wrapper. Select another
            component to edit.
          </Text>
        </Center>
      </Box>
    );
  }

  const selectComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );
  const mappedComponent = componentMapper[selectComponent?.name as string];

  const sections = mappedComponent?.modifiers?.map((id) => {
    const modifier = sectionMapper[id as string];

    return {
      id: id,
      label: modifier.label,
      icon: modifier.icon,
      initiallyOpened: id === "layout",
      Component: modifier.Modifier,
    };
  });

  const sectionsToRender = sections?.map(({ Component, ...item }) => (
    <SidebarSection {...item} key={item.label}>
      <Component />
    </SidebarSection>
  ));

  return <>{sectionsToRender}</>;
};
