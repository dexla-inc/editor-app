import { LARGE_ICON_SIZE } from "@/utils/config";
import { Alert, DefaultMantineColor } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconExclamationMark,
  IconInfoCircle,
} from "@tabler/icons-react";

interface BaseAlertProps extends AlertProps {
  icon: React.ReactNode;
  color: DefaultMantineColor;
}

export interface AlertProps {
  title: string;
  text: string;
}

function BaseAlert({ icon, title, text, color }: BaseAlertProps) {
  return (
    <Alert icon={icon} title={title} color={color}>
      {text}
    </Alert>
  );
}

export function InformationAlert({ title, text }: AlertProps) {
  return (
    <BaseAlert
      icon={<IconInfoCircle size={LARGE_ICON_SIZE} />}
      title={title}
      text={text}
      color="indigo"
    />
  );
}

export function WarningAlert({ title, text }: AlertProps) {
  return (
    <BaseAlert
      icon={<IconAlertTriangle size={LARGE_ICON_SIZE} />}
      title={title}
      text={text}
      color="yellow"
    />
  );
}

export function ErrorAlert({ title, text }: AlertProps) {
  return (
    <BaseAlert
      icon={<IconExclamationMark size={LARGE_ICON_SIZE} />}
      title={title}
      text={text}
      color="red"
    />
  );
}

export function SuccessAlert({ title, text }: AlertProps) {
  return (
    <BaseAlert
      icon={<IconCheck size={LARGE_ICON_SIZE} />}
      title={title}
      text={text}
      color="green"
    />
  );
}
