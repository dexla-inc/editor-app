import { DataSourceResponse } from "@/requests/datasources/types";
import { NotificationProps } from "@mantine/notifications";

export type NavbarTypes = "editor" | "company" | "project";

export type ToggleMenuItem = {
  id: string;
  icon: React.ReactNode;
  onClick: () => void;
  text: string;
};

export type NextStepperClickEvent = {
  nextStep: () => void;
};

export type PreviousStepperClickEvent = {
  prevStep: () => void;
};

export type LoadingStore = {
  isLoading: boolean;
  startLoading: (state: NotificationProps) => void;
  stopLoading: (state: NotificationProps) => void;
};

export type StepperStepProps = {
  label: string;
  description: string;
};

export interface DexlaStepperProps extends StepperState {
  details: StepperStepProps[];
}

export type StepperState = {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export function isWebsite(value: string): boolean {
  return /^https?:\/\/.+/i.test(value);
}

export function isSwaggerFile(url: string) {
  return url.endsWith(".json") || url.endsWith(".yaml");
}

type DataSourceSettingsProps = {
  dataSource: DataSourceResponse | undefined;
  setDataSource: (dataSource: DataSourceResponse) => void;
};

export interface DataSourceStepperProps
  extends DataSourceSettingsProps,
    LoadingStore,
    NextStepperClickEvent,
    PreviousStepperClickEvent {}

export interface DataSourceStepperWithoutPreviousProps
  extends DataSourceSettingsProps,
    LoadingStore,
    NextStepperClickEvent {}

export interface DataSourceStepperWithoutNextProps
  extends DataSourceSettingsProps,
    LoadingStore,
    PreviousStepperClickEvent {}
