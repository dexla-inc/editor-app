import { EditorNavbarComponentsSection } from "@/components/navbar/EditorNavbarComponentsSection";
import { EditorNavbarLayersSection } from "@/components/navbar/EditorNavbarLayersSection";
import { EditorNavbarPagesSection } from "@/components/navbar/EditorNavbarPagesSection";
import { EditorNavbarThemesSection } from "@/components/navbar/EditorNavbarThemesSection";
import { EditorSettingsSection } from "@/components/navbar/EditorSettingsSection";
import { useEditorStore } from "@/stores/editor";
import {
  IconBrush,
  IconComponents,
  IconFileInvoice,
  IconLayoutDashboard,
  IconSettings,
} from "@tabler/icons-react";
import { NavbarSection } from "./NavbarSection";

type SectionId = "pages" | "layers" | "components" | "theme" | "settings";

const sections = [
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
    id: "pages" as SectionId,
    label: "Pages",
    icon: IconFileInvoice,
  },
  {
    id: "theme" as SectionId,
    label: "Theme",
    icon: IconBrush,
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
  layers: (props: any) => <EditorNavbarLayersSection {...props} />,
  components: (props: any) => <EditorNavbarComponentsSection {...props} />,
  theme: (props: any) => <EditorNavbarThemesSection {...props} />,
  settings: (props: any) => <EditorSettingsSection {...props} />,
  // Do not need this any longer as actions handle it. We do need a way to map things like headers though from a global level. Maybe this can be done here.
  //datasources: (props: any) => <EditorNavbarDataSourcesSection {...props} />,
};

export const EditorNavbarSections = () => {
  const { activeTab } = useEditorStore();

  const item = sections.find((item) => item.id === activeTab);

  return (
    <>
      <NavbarSection sections={sections} layers={sectionMapper.layers}>
        {item &&
          sectionMapper[item.id]({
            ...item,
            isActive: item.id === activeTab,
          })}
      </NavbarSection>
    </>
  );
};
