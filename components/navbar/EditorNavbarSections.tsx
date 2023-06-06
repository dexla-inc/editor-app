import { SidebarSection } from "@/components/SidebarSection";
import {
  IconFileInvoice,
  IconLayoutDashboard,
  IconStack2,
} from "@tabler/icons-react";
import { EditorNavbarComponentsSection } from "@/components/navbar/EditorNavbarComponentsSection";
import { EditorNavbarPagesSection } from "@/components/navbar/EditorNavbarPagesSection";
import { EditorNavbarLayersSection } from "@/components/navbar/EditorNavbarLayersSection";

const sections = [
  {
    id: "pages",
    label: "Pages",
    icon: IconFileInvoice,
  },
  {
    id: "layers",
    label: "Page Structure",
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
  pages: (props: any) => <EditorNavbarPagesSection {...props} />,
  layers: (props: any) => <EditorNavbarLayersSection {...props} />,
  components: (props: any) => <EditorNavbarComponentsSection {...props} />,
};

export const EditorNavbarSections = () => {
  const sectionsToRender = sections.map((item) => (
    <SidebarSection {...item} key={item.label}>
      {sectionMapper[item.id as string](item)}
    </SidebarSection>
  ));

  return <>{sectionsToRender}</>;
};
