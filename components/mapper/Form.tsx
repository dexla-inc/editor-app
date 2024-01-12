import { isSame } from "@/utils/componentComparison";
import {
  Component,
  debouncedTreeUpdate,
  getAllComponentsByName,
  updateInputFieldsWithFormData,
} from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormEvent, forwardRef, memo, useMemo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { componentMapper } from "@/utils/componentMapper";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";

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
    const updateTreeComponent = useEditorStore(
      (state) => state.updateTreeComponent,
    );
    const getInputValue = useInputsStore((state) => state.getValue);

    const validatableComponentsList = useMemo(
      () =>
        Object.entries(componentMapper).reduce((acc, [key, value]) => {
          if (value.isValidatable) {
            acc.push(key);
          }
          return acc;
        }, [] as string[]),
      [],
    );

    const onSubmitCustom = async (e: FormEvent<any>) => {
      e.preventDefault();

      const validatableComponents = getAllComponentsByName(
        component,
        validatableComponentsList,
        { withAsterisk: true },
      ).filter(
        (component) =>
          getInputValue(component?.id!) === "" ||
          getInputValue(component?.id!) === undefined,
      );

      validatableComponents.map((component) => {
        return updateTreeComponent({
          componentId: component.id!,
          props: { error: `${component?.props?.name} is required` },
          save: false,
        });
      });

      if (!validatableComponents.length && triggers.onSubmit) {
        return triggers.onSubmit && triggers.onSubmit(e);
      }
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
        {component.children?.map((child) => {
          updateInputFieldsWithFormData(child, onChangeField);
          return renderTree({
            ...child!,
            props: { ...child.props, ...triggers },
          });
        })}
        <LoadingOverlay visible={loading} zIndex={1000} radius="sm" />
      </MantineFlex>
    );
  },
);
FormComponent.displayName = "Form";

export const Form = memo(withComponentWrapper<Props>(FormComponent), isSame);
