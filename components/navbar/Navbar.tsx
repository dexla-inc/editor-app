import { HEADER_HEIGHT, NAVBAR_MIN_WIDTH, NAVBAR_WIDTH } from "@/utils/config";
import { EditorNavbarSections } from "@/components/navbar/EditorNavbarSections";
import { Navbar as MantineNavbar } from "@mantine/core";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useEditorStore } from "@/stores/editor";
import { memo } from "react";

export const NavbarComponent = () => {
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);

  if (isPreviewMode || !isNavBarVisible) return undefined;

  return (
    <MantineNavbar
      miw={{ base: NAVBAR_MIN_WIDTH }}
      width={{ base: NAVBAR_MIN_WIDTH }}
      maw={{ base: NAVBAR_WIDTH }}
      sx={{
        height: `calc(100% - ${HEADER_HEIGHT}px)`,
        zIndex: 200,
      }}
    >
      <MantineNavbar.Section grow py="sm">
        <EditorNavbarSections />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export const Navbar = memo(NavbarComponent);
