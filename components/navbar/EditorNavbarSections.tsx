import { SidebarSection } from "@/components/SidebarSection";
import { EditorNavbarComponentsSection } from "@/components/navbar/EditorNavbarComponentsSection";
import { EditorNavbarLayersSection } from "@/components/navbar/EditorNavbarLayersSection";
import { EditorNavbarPagesSection } from "@/components/navbar/EditorNavbarPagesSection";
import { EditorNavbarThemesSection } from "@/components/navbar/EditorNavbarThemesSection";
import {
  IconBrush,
  IconFileInvoice,
  IconLayoutDashboard,
  IconStack2,
} from "@tabler/icons-react";
import { useState } from "react";

type SectionId = "pages" | "layers" | "components" | "theme";

const sections = [
  {
    id: "pages" as SectionId,
    label: "Pages",
    icon: IconFileInvoice,
  },
  {
    id: "layers" as SectionId,
    label: "Page Structure",
    icon: IconStack2,
    initiallyOpened: true,
  },
  {
    id: "components" as SectionId,
    label: "Components",
    icon: IconLayoutDashboard,
  },
  {
    id: "theme" as SectionId,
    label: "Theme",
    icon: IconBrush,
  },
  // {
  //   id: "datasources",
  //   label: "Data Sources",
  //   icon: IconDatabase,
  // },
];

type SectionsMapper = {
  [key in SectionId]: any;
};

const sectionMapper: SectionsMapper = {
  pages: (props: any) => <EditorNavbarPagesSection {...props} />,
  layers: (props: any) => <EditorNavbarLayersSection {...props} />,
  components: (props: any) => <EditorNavbarComponentsSection {...props} />,
  theme: (props: any) => <EditorNavbarThemesSection {...props} />,
  // Do not need this any longer as actions handle it. We do need a way to map things like headers though from a global level. Maybe this can be done here.
  //datasources: (props: any) => <EditorNavbarDataSourcesSection {...props} />,
};

export const EditorNavbarSections = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const sectionsToRender = sections.map((item) => (
    <SidebarSection
      {...item}
      key={item.label}
      onClick={() => setActiveTab(item.id)}
    >
      {sectionMapper[item.id]({
        ...item,
        isActive: item.id === activeTab,
      })}
    </SidebarSection>
  ));

  return <>{sectionsToRender}</>;
};
