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
  setIsLoading?: (isLoading: boolean) => void;
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

export function areValuesEqual<T extends {}>(obj1: T, obj2: T): boolean {
  const properties = keysOf<T>(obj1);
  for (let prop of properties) {
    if (obj1[prop] !== obj2?.[prop]) {
      return false;
    }
  }
  return true;
}

export function keysOf<T extends {}>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
