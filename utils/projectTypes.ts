import {
  LoadingStore,
  NextStepperClickEvent,
  PreviousStepperClickEvent,
} from "@/utils/dashboardTypes";

export type StepperDetailsType = {
  [key: number]: { title: string };
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
