import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { componentMapper } from "@/utils/componentMapper";
import { convertSizeToPx } from "@/utils/defaultSizes";
import {
  EditableComponentMapper,
  getAllComponentsByName,
} from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { FormEvent, forwardRef, memo, useMemo } from "react";
import { memoize } from "proxy-memoize";

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
    const setInputValue = useInputsStore((state) => state.setInputValue);

    const onLoad = useEditorTreeStore(
      memoize((state) => state.componentMutableAttrs[component?.id!]?.onLoad),
    );

    const { endpointId } = onLoad ?? {};
    component.onLoad = onLoad;
    const { data } = useEndpoint({
      component,
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

      invalidComponents.forEach((component) => {
        updateTreeComponentAttrs({
          componentIds: [component.id!],
          attrs: { props: { error: `${component?.description} is required` } },
          save: false,
        });
      });

      if (invalidComponents.length) {
        submitButtonComponents.map((component) => {
          setState(component.id!, "disabled");
        });
      }

      if (!invalidComponents.length && triggers.onSubmit) {
        triggers.onSubmit(e);
        formFieldComponents.map((component) =>
          setInputValue(component.id!, ""),
        );
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
        {!endpointId && component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children}
        <LoadingOverlay visible={loading} zIndex={1000} radius="sm" />
      </MantineFlex>
    );
  },
);
FormComponent.displayName = "Form";

export const Form = memo(withComponentWrapper<Props>(FormComponent), isSame);
