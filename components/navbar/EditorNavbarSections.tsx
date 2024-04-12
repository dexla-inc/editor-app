import { EditorAssetsSection } from "@/components/navbar/EditorAssetsSection";
import { EditorNavbarComponentsSection } from "@/components/navbar/EditorNavbarComponentsSection";
import { EditorNavbarCustomCodeSection } from "@/components/navbar/EditorNavbarCustomCodeSection";
import { EditorNavbarDataSourcesSection } from "@/components/navbar/EditorNavbarDataSourcesSection";
import { EditorNavbarPagesSection } from "@/components/navbar/EditorNavbarPagesSection";
import { EditorNavbarSettingsSection } from "@/components/navbar/EditorNavbarSettingsSection";
import { EditorNavbarThemesSection } from "@/components/navbar/EditorNavbarThemesSection";
import { NavbarSection } from "@/components/navbar/NavbarSection";
import { NavbarLayersSection } from "@/components/navbar/PageStructure/SortableTree";
import { useEditorStore } from "@/stores/editor";
import {
  IconBrush,
  IconCode,
  IconComponents,
  IconDatabase,
  IconFileInvoice,
  IconHistory,
  IconLayoutDashboard,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";
import { EditorHistorySection } from "./EditorHistorySection";
import { useMemo } from "react";

export type SectionId =
  | "pages"
  | "layers"
  | "components"
  | "theme"
  | "datasources"
  | "customCode"
  | "history"
  | "settings"
  | "assets";

const sections = [
  {
    id: "pages" as SectionId,
    label: "Pages",
    icon: IconFileInvoice,
  },
  {
    id: "layers" as SectionId,
    label: "Page Structure",
    icon: IconLayoutDashboard,
    initiallyOpened: true,
  },
  {
    id: "components" as SectionId,
    label: "Components",
    icon: IconComponents,
  },
  {
    id: "theme" as SectionId,
    label: "Brand",
    icon: IconBrush,
  },
  {
    id: "datasources" as SectionId,
    label: "Datasources",
    icon: IconDatabase,
  },
  {
    id: "assets" as SectionId,
    label: "Assets",
    icon: IconPhoto,
  },
  {
    id: "history" as SectionId,
    label: "History",
    icon: IconHistory,
  },
  {
    id: "customCode" as SectionId,
    label: "Custom Code",
    icon: IconCode,
  },
  {
    id: "settings" as SectionId,
    label: "Settings",
    icon: IconSettings,
  },
];

export type Sections = typeof sections;

type SectionsMapper = {
  [key in SectionId]: any;
};

export const sectionMapper: SectionsMapper = {
  pages: (props: any) => <EditorNavbarPagesSection {...props} />,
  layers: (props: any) => <NavbarLayersSection {...props} />,
  components: (props: any) => <EditorNavbarComponentsSection {...props} />,
  theme: (props: any) => <EditorNavbarThemesSection {...props} />,
  datasources: (props: any) => <EditorNavbarDataSourcesSection {...props} />,
  history: (props: any) => <EditorHistorySection {...props} />,
  assets: (props: any) => <EditorAssetsSection {...props} />,
  customCode: (props: any) => <EditorNavbarCustomCodeSection {...props} />,
  settings: (props: any) => <EditorNavbarSettingsSection {...props} />,
};

export const EditorNavbarSections = () => {
  const activeTab = useEditorStore((state) => state.activeTab);

  const selectedSection = useMemo(() => {
    const item = sections.find((item) => item.id === activeTab);

    if (!item) return null;

    return sectionMapper[item.id]({
      ...item,
      isActive: item.id === activeTab,
    });
  }, [activeTab]);

  return <NavbarSection sections={sections}>{selectedSection}</NavbarSection>;
};
