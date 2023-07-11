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
import { useState } from "react";

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
    initiallyOpened: true,
  },
  {
    id: "components",
    label: "Components",
    icon: IconLayoutDashboard,
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
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const sectionsToRender = sections.map((item) => (
    <SidebarSection
      {...item}
      key={item.label}
      onClick={() => setActiveTab(item.id)}
    >
      {sectionMapper[item.id as string]({
        ...item,
        isActive: item.id === activeTab,
      })}
    </SidebarSection>
  ));

  return <>{sectionsToRender}</>;
};
