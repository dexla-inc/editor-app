import { SidebarSection } from "@/components/SidebarSection";
import { Text } from "@mantine/core";
import {
  IconFileInvoice,
  IconLayoutDashboard,
  IconStack2,
} from "@tabler/icons-react";
import { EditorNvbarComponentsSection } from "@/components/EditorNavbarComponentsSection";

const sections = [
  {
    id: "pages",
    label: "Pages",
    icon: IconFileInvoice,
  },
  {
    id: "layers",
    label: "Layers",
    icon: IconStack2,
  },
  {
    id: "components",
    label: "Components",
    icon: IconLayoutDashboard,
    initiallyOpened: true,
  },
];

type SectionsMapper = {
  [key: string]: any;
};

const sectionMapper: SectionsMapper = {
  pages: (props: any) => <Text size="xs">{props.label}</Text>,
  layers: (props: any) => <Text size="xs">{props.label}</Text>,
  components: (props: any) => <EditorNvbarComponentsSection {...props} />,
};

export const EditorNavbarSections = () => {
  const sectionsToRender = sections.map((item) => (
    <SidebarSection {...item} key={item.label}>
      {sectionMapper[item.id as string](item)}
    </SidebarSection>
  ));

  return <>{sectionsToRender}</>;
};
