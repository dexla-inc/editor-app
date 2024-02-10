import {
  PasswordInput as MantinePasswordInput,
  PasswordInputProps,
} from "@mantine/core";
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
  displayRequirements?: boolean;
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
  displayRequirements,
  testParameters,
  color,
  onChange,
  props,
  restComponentProps,
}: Props) => {
  return (
    <PasswordInputWrapper
      value={value}
      testParameters={testParameters}
      isPreviewMode={isPreviewMode}
      displayRequirements={displayRequirements}
      width={customStyle.width}
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
        onChange={onChange}
      />
    </PasswordInputWrapper>
  );
};
