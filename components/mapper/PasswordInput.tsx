import {
  PasswordInput as MantinePasswordInput,
  PasswordInputProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { pick } from "next/dist/lib/pick";
import { PasswordInputWrapper } from "./PasswordInputWrapper";

type Props = Omit<PasswordInputProps, "value"> & {
  componentId: string;
  ref: any;
  value: string;
  isPreviewMode: Boolean;
  iconComponent: any;
  iconName?: string;
  customStyle: any;
  testParameters: Record<string, any>;
  props: any;
  restComponentProps: any;
};

export const PasswordInput = ({
  componentId,
  ref,
  value,
  isPreviewMode,
  customStyle,
  iconComponent: Icon,
  iconName,
  testParameters,
  color,
  onChange,
  props,
  restComponentProps,
}: Props) => {
  const [openPasswordPopover, { open, close }] = useDisclosure(false);

  const onChangePassword = (e: any) => {
    if (!openPasswordPopover) {
      open();
    }
    onChange && onChange(e);
  };

  return (
    <PasswordInputWrapper
      value={value}
      openPasswordPopover={openPasswordPopover}
      testParameters={testParameters}
      isPreviewMode={isPreviewMode}
    >
      <MantinePasswordInput
        {...props}
        {...restComponentProps}
        ref={ref}
        id={componentId}
        icon={iconName ? <Icon name={iconName} /> : null}
        style={{}}
        styles={{
          root: {
            position: "relative",
            ...pick(customStyle, ["display", "width", "minHeight", "minWidth"]),
            height: "fit-content",
          },
          input: customStyle,
          innerInput: { ...pick(customStyle, ["height"]), color },
        }}
        value={value}
        onChange={onChangePassword}
        onFocus={open}
        onBlur={close}
        onKeyDown={(e) => e.key === "Escape" && close()}
      />
    </PasswordInputWrapper>
  );
};
