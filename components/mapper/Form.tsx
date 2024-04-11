import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isSame } from "@/utils/componentComparison";
import { componentMapper } from "@/utils/componentMapper";
import { convertSizeToPx } from "@/utils/defaultSizes";
import {
  EditableComponentMapper,
  getAllComponentsByName,
} from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { FormEvent, forwardRef, memo } from "react";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & FlexProps;

const FormComponent = forwardRef(
  (
    { renderTree, component, isPreviewMode, shareableContent, ...props }: Props,
    ref,
  ) => {
    const { children, triggers, loading, dataType, gap, ...componentProps } =
      component.props as any;
    const { onSubmit, ...otherTriggers } = triggers || {};
    const { style, ...otherProps } = props as any;
    const gapPx = convertSizeToPx(gap, "gap");
    const setState = useEditorTreeStore(
      (state) => state.setTreeComponentCurrentState,
    );

    const onLoad = useEditorTreeStore(
      useShallow(
        (state) => state.componentMutableAttrs[component?.id!]?.onLoad,
      ),
    );

    const { endpointId } = onLoad ?? {};
    const { data } = useEndpoint({
      onLoad,
      dataType,
    });

    const onSubmitCustom = async (e: FormEvent<any>) => {
      e.preventDefault();

      if (!isPreviewMode) {
        return;
      }

      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;

      const inputValues = useInputsStore.getState().inputValues;

      const validatableComponentsList = Object.entries(componentMapper).reduce(
        (acc, [key, value]) => {
          if (value.isValidatable) {
            acc.push(key);
          }
          return acc;
        },
        [] as string[],
      );

      const formFieldComponents = getAllComponentsByName(
        component,
        validatableComponentsList,
      );

      const submitButtonComponents = getAllComponentsByName(
        component,
        "Button",
        {
          type: "submit",
        },
      );

      const invalidComponents = formFieldComponents.filter(
        (component) =>
          (inputValues[component?.id!] === "" ||
            inputValues[component?.id!] === undefined) &&
          component?.props?.withAsterisk,
      );

      // re-setting error messages onSubmit
      formFieldComponents.forEach((component) => {
        updateTreeComponentAttrs({
          componentIds: [component.id!],
          attrs: { props: { error: `` } },
          save: false,
        });
      });

      if (invalidComponents.length) {
        invalidComponents.forEach((component) => {
          updateTreeComponentAttrs({
            componentIds: [component.id!],
            attrs: {
              props: { error: `${component?.description} is required` },
            },
            save: false,
          });
        });
        submitButtonComponents.map((component) => {
          setState(component.id!, "disabled");
        });
      } else {
        onSubmit && onSubmit(e);
      }
    };

    return (
      <MantineFlex
        ref={ref}
        {...otherProps}
        {...componentProps}
        style={{
          ...style,
          gap: gapPx,
        }}
        component="form"
        autoComplete={isPreviewMode ? "on" : "off"}
        onSubmit={onSubmitCustom}
        {...otherTriggers}
        pos="relative"
      >
        {endpointId &&
          Array.isArray(data) &&
          data?.map((item: any, parentIndex: number) => {
            return component.children && component.children.length > 0
              ? component.children?.map((child) =>
                  renderTree(child, {
                    ...shareableContent,
                    data: item,
                    parentIndex,
                  }),
                )
              : children;
          })}
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, { ...shareableContent, data }),
            )
          : children}
        <LoadingOverlay visible={loading} zIndex={1000} radius="sm" />
      </MantineFlex>
    );
  },
);
FormComponent.displayName = "Form";

export const Form = memo(withComponentWrapper<Props>(FormComponent), isSame);
