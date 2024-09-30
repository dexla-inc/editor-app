import { PasswordInputWrapper } from "@/components/mapper/PasswordInputWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  PasswordInput as MantinePasswordInput,
  PasswordInputProps,
} from "@mantine/core";
import { pick } from "next/dist/lib/pick";
import { CSSProperties } from "react";
import { useShallow } from "zustand/react/shallow";

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
  componentProps: any;
  rootStyleProps: Array<keyof CSSProperties>;
};

export const PasswordInput = ({
  componentId,
  ref,
  value,
  customStyle,
  iconComponent: Icon,
  iconName,
  displayRequirements,
  testParameters,
  color,
  onChange,
  props,
  componentProps,
  rootStyleProps,
  ...rest
}: Props) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );

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
        {...componentProps}
        {...rest}
        ref={ref}
        id={componentId}
        icon={iconName ? <Icon name={iconName} /> : null}
        style={{}}
        styles={{
          root: {
            ...pick(customStyle, rootStyleProps),
            position: "relative",
            height: "fit-content",
          },
          input: { ...customStyle, minHeight: "auto" },
          innerInput: { ...pick(customStyle, ["height"]), color },
        }}
        value={value}
        onChange={onChange}
      />
    </PasswordInputWrapper>
  );
};
