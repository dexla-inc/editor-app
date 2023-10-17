import { useEditorStore } from "@/stores/editor";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export const ToggleNavbarButton = () => {
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);
  const setIsNavBarVisible = useEditorStore(
    (state) => state.setIsNavBarVisible,
  );
  const IconToggle = isNavBarVisible ? IconChevronLeft : IconChevronRight;

  return (
    <IconToggle
      onClick={setIsNavBarVisible}
      style={{ transform: "rotate(-90deg)", cursor: "pointer" }}
    />
  );
};
