export type NavbarTypes = "editor" | "company" | "project";

export type ToggleMenuItem = {
  id: string;
  icon: React.ReactNode;
  onClick: () => void;
  text: string;
};
