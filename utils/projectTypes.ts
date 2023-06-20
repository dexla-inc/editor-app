import { NotificationProps } from "@mantine/notifications";

export type StepperClickEvents = {
  nextStep?: () => void;
  prevStep?: () => void;
};

export type StepperState = {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export type StepperDetailsType = {
  [key: number]: { title: string };
};

export type LoadingStore = {
  isLoading: boolean;
  startLoading: (state: NotificationProps) => void;
  stopLoading: (state: NotificationProps) => void;
};

export type ProjectTypes = "INNOVATION" | "SIMILAR" | "INTERNAL";

export type ProjectTypeMap = Record<ProjectTypes, ProjectInfo>;

export type ProjectInfo<
  TLabel extends string = string,
  TPlaceholder extends string = string,
  TExample extends string = string,
  TTitle extends string = string,
  TIndustryPlaceholder extends string = string
> = {
  label: TLabel;
  placeholder: TPlaceholder;
  example: TExample;
  title: TTitle;
  industryPlaceholder: TIndustryPlaceholder;
};

export type PageStreamState = {
  pageStream: string;
  setPageStream: React.Dispatch<React.SetStateAction<string>>;
};

export type PagesState = {
  pages: string[];
  setPages: React.Dispatch<React.SetStateAction<string[]>>;
};
