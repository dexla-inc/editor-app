import { NotificationProps } from "@mantine/notifications";

type NextStepperClickEvent = {
  nextStep: () => void;
};

type PreviousStepperClickEvent = {
  prevStep: () => void;
};

export type StepperState = {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export type StepperDetailsType = {
  [key: number]: { title: string };
};

type LoadingStore = {
  isLoading: boolean;
  startLoading: (state: NotificationProps) => void;
  stopLoading: (state: NotificationProps) => void;
};

export interface ProjectStepProps extends LoadingStore, NextStepperClickEvent {
  setProjectId: (id: string) => void;
}

export interface PagesStepProps
  extends LoadingStore,
    PreviousStepperClickEvent {
  projectId: string;
}

export interface BrandingStepProps
  extends LoadingStore,
    NextStepperClickEvent,
    PreviousStepperClickEvent {
  projectId: string;
}

export type ProjectTypes = "INNOVATION" | "SIMILAR" | "INTERNAL";

export function isProjectType(type: string): type is ProjectTypes {
  return ["INNOVATION", "SIMILAR", "INTERNAL"].includes(type);
}

// Could probably move this to a more general location
export function isWebsite(value: string): boolean {
  return /^https?:\/\/.+/i.test(value);
}

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
