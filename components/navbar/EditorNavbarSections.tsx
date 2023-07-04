import { SidebarSection } from "@/components/SidebarSection";
import { EditorNavbarComponentsSection } from "@/components/navbar/EditorNavbarComponentsSection";
import { EditorNavbarDataSourcesSection } from "@/components/navbar/EditorNavbarDataSourcesSection";
import { EditorNavbarLayersSection } from "@/components/navbar/EditorNavbarLayersSection";
import { EditorNavbarPagesSection } from "@/components/navbar/EditorNavbarPagesSection";
import { EditorNavbarThemesSection } from "@/components/navbar/EditorNavbarThemesSection";
import {
  IconBrush,
  IconDatabase,
  IconFileInvoice,
  IconLayoutDashboard,
  IconStack2,
} from "@tabler/icons-react";

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
  {
    id: "theme",
    label: "Theme",
    icon: IconBrush,
  },
  {
    id: "datasources",
    label: "Data Sources",
    icon: IconDatabase,
  },
];

type SectionsMapper = {
  [key: string]: any;
};

const sectionMapper: SectionsMapper = {
  pages: (props: any) => <EditorNavbarPagesSection {...props} />,
  layers: (props: any) => <EditorNavbarLayersSection {...props} />,
  components: (props: any) => <EditorNavbarComponentsSection {...props} />,
  theme: (props: any) => <EditorNavbarThemesSection {...props} />,
  datasources: (props: any) => <EditorNavbarDataSourcesSection {...props} />,
};

export const EditorNavbarSections = () => {
  const sectionsToRender = sections.map((item) => (
    <SidebarSection {...item} key={item.label}>
      {sectionMapper[item.id as string](item)}
    </SidebarSection>
  ));

  return <>{sectionsToRender}</>;
};
