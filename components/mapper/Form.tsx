import { isSame } from "@/utils/componentComparison";
import { Component, updateInputFieldsWithFormData } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormEvent, forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & FlexProps;

const FormComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, triggers, loading, ...componentProps } =
      component.props as any;
    const { onSubmit, ...otherTriggers } = triggers;
    const form = useForm();

    const onSubmitCustom = (e: FormEvent<any>) => {
      e.preventDefault();
      return triggers.onSubmit(e);
    };

    const onChangeField = (e: any) => {
      form.setFieldValue(e.target.name, e.target.value);
    };

    return (
      <MantineFlex
        ref={ref}
        {...props}
        {...componentProps}
        component="form"
        autoComplete={props.isPreviewMode ? "on" : "off"}
        onSubmit={onSubmitCustom}
        {...otherTriggers}
        pos="relative"
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => {
              updateInputFieldsWithFormData(child, onChangeField);
              return renderTree({
                ...child!,
                props: { ...child.props, ...triggers },
              });
            })
          : children}
        <LoadingOverlay visible={loading} zIndex={1000} radius="sm" />
      </MantineFlex>
    );
  },
);
FormComponent.displayName = "Form";

export const Form = memo(withComponentWrapper<Props>(FormComponent), isSame);
