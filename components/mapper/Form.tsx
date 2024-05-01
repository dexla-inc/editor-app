import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import { useEditorTreeStore } from "@/stores/editorTree";
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
import { useRenderData } from "@/hooks/components/useRenderData";

type Props = EditableComponentMapper & FlexProps;

const FormComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );

    const { children, triggers, loading, dataType, gap, ...componentProps } =
      component.props as any;
    const { onSubmit, ...otherTriggers } = triggers || {};
    const { style, ...otherProps } = props as any;
    const gapPx = convertSizeToPx(gap, "gap");
    const setState = useEditorTreeStore(
      (state) => state.setTreeComponentCurrentState,
    );

    const { endpointId } = component.onLoad ?? {};
    const { data } = useEndpoint({
      onLoad: component.onLoad,
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

    const { renderData } = useRenderData({ component });

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
        {renderData({ renderTree, shareableContent })}
        <LoadingOverlay visible={loading} zIndex={1000} radius="sm" />
      </MantineFlex>
    );
  },
);
FormComponent.displayName = "Form";

export const Form = memo(withComponentWrapper<Props>(FormComponent));
