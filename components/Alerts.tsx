import { LARGE_ICON_SIZE } from "@/utils/config";
import {
  Alert,
  DefaultMantineColor,
  MantineSize,
  TypographyStylesProvider,
} from "@mantine/core";
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
  title?: string;
  text?: string;
  size?: MantineSize;
  isHtml?: boolean;
  children?: React.ReactNode;
}

function BaseAlert({
  icon,
  title,
  color,
  isHtml,
  children,
  text,
}: BaseAlertProps) {
  return (
    <Alert icon={icon} title={title} color={color}>
      {isHtml ? (
        <TypographyStylesProvider>
          <div style={{ fontSize: "14px" }}>{children}</div>
        </TypographyStylesProvider>
      ) : (
        text
      )}
    </Alert>
  );
}

export function InformationAlert({
  title,
  text,
  size,
  isHtml,
  children,
}: AlertProps) {
  return (
    <BaseAlert
      icon={<IconInfoCircle size={LARGE_ICON_SIZE} />}
      color="indigo"
      title={title}
      text={text}
      size={size}
      isHtml={isHtml}
    >
      {children}
    </BaseAlert>
  );
}

export function WarningAlert({
  title,
  text,
  size,
  isHtml,
  children,
}: AlertProps) {
  return (
    <BaseAlert
      icon={<IconAlertTriangle size={LARGE_ICON_SIZE} />}
      color="yellow"
      title={title}
      size={size}
      isHtml={isHtml}
      text={text}
    >
      {children}
    </BaseAlert>
  );
}

export function ErrorAlert({
  title,
  text,
  size,
  isHtml,
  children,
}: AlertProps) {
  return (
    <BaseAlert
      icon={<IconExclamationMark size={LARGE_ICON_SIZE} />}
      color="red"
      title={title}
      size={size}
      isHtml={isHtml}
      text={text}
    >
      {children}
    </BaseAlert>
  );
}

export function SuccessAlert({
  title,
  text,
  size,
  isHtml,
  children,
}: AlertProps) {
  return (
    <BaseAlert
      icon={<IconCheck size={LARGE_ICON_SIZE} />}
      color="green"
      title={title}
      size={size}
      isHtml={isHtml}
      text={text}
    >
      {children}
    </BaseAlert>
  );
}
