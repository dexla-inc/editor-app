import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { componentMapper } from "@/utils/componentMapper";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { FormEvent, forwardRef, memo, useMemo } from "react";

type Props = {
  renderTree: (component: Component, shareableContent: any) => any;
  component: Component;
  isPreviewMode?: boolean;
  shareableContent?: any;
} & FlexProps;

const FormComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, triggers, loading, dataType, ...componentProps } =
      component.props as any;
    const { onSubmit, ...otherTriggers } = triggers;
    const updateTreeComponent = useEditorStore(
      (state) => state.updateTreeComponent,
    );
    const theme = useEditorStore((state) => state.theme);
    const getInputValue = useInputsStore((state) => state.getValue);
    const setInputValue = useInputsStore((state) => state.setInputValue);

    const { endpointId } = component.onLoad ?? {};
    const { data } = useEndpoint({
      component,
    });

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

      const formFieldComponents = getAllComponentsByName(
        component,
        validatableComponentsList,
        { withAsterisk: true },
      );

      const invalidComponents = formFieldComponents.filter(
        (component) =>
          getInputValue(component?.id!) === "" ||
          getInputValue(component?.id!) === undefined,
      );

      invalidComponents.map((component) => {
        return updateTreeComponent({
          componentId: component.id!,
          props: { error: `${component?.description} is required` },
          save: false,
        });
      });

      if (!invalidComponents.length && triggers.onSubmit) {
        triggers.onSubmit && triggers.onSubmit(e);
        formFieldComponents.map((component) =>
          setInputValue(component.id!, ""),
        );
      }
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
        {endpointId &&
          data?.map((item: any, repeatedIndex: number) => {
            return component.children && component.children.length > 0
              ? component.children?.map((child) =>
                  renderTree(
                    {
                      ...child,
                      props: {
                        ...child.props,
                        repeatedIndex,
                      },
                    },
                    {
                      ...shareableContent,
                      parentDataComponentId: component.id,
                      data: item,
                    },
                  ),
                )
              : children;
          })}
        {!endpointId && component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(
                {
                  ...child,
                  props: { ...child.props },
                },
                shareableContent,
              ),
            )
          : children}
        <LoadingOverlay visible={loading} zIndex={1000} radius="sm" />
      </MantineFlex>
    );
  },
);
FormComponent.displayName = "Form";

export const Form = memo(withComponentWrapper<Props>(FormComponent), isSame);
