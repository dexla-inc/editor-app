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
  text: string;
  size?: MantineSize;
  isHtml?: boolean;
}

function BaseAlert({ icon, title, text, color, isHtml }: BaseAlertProps) {
  return (
    <Alert icon={icon} title={title} color={color}>
      {!isHtml ? (
        text
      ) : (
        <TypographyStylesProvider>
          <div
            dangerouslySetInnerHTML={{ __html: text }}
            style={{ fontSize: "14px" }}
          />
        </TypographyStylesProvider>
      )}
    </Alert>
  );
}

export function InformationAlert({ title, text, size, isHtml }: AlertProps) {
  return (
    <BaseAlert
      icon={<IconInfoCircle size={LARGE_ICON_SIZE} />}
      title={title}
      text={text}
      color="indigo"
      size={size}
      isHtml={isHtml}
    />
  );
}

export function WarningAlert({ title, text, size, isHtml }: AlertProps) {
  return (
    <BaseAlert
      icon={<IconAlertTriangle size={LARGE_ICON_SIZE} />}
      title={title}
      text={text}
      color="yellow"
      size={size}
      isHtml={isHtml}
    />
  );
}

export function ErrorAlert({ title, text, size, isHtml }: AlertProps) {
  return (
    <BaseAlert
      icon={<IconExclamationMark size={LARGE_ICON_SIZE} />}
      title={title}
      text={text}
      color="red"
      size={size}
      isHtml={isHtml}
    />
  );
}

export function SuccessAlert({ title, text, size, isHtml }: AlertProps) {
  return (
    <BaseAlert
      icon={<IconCheck size={LARGE_ICON_SIZE} />}
      title={title}
      text={text}
      color="green"
      size={size}
      isHtml={isHtml}
    />
  );
}
