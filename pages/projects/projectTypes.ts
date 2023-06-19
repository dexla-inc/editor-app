import { NotificationProps } from "@mantine/notifications";

export type StepperState = {
  nextStep: () => void;
  prevStep?: () => void;
};

export type StepperAction = {
  activeStep: number;
  setActiveStep?: (value: number) => void;
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
