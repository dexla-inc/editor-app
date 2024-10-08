import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import { structureMapper } from "@/utils/componentMapper";
import { convertSizeToPx } from "@/utils/defaultSizes";
import {
  EditableComponentMapper,
  getAllComponentsByName,
} from "@/utils/editor";
import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import LoadingOverlay from "@/components/LoadingOverlay";
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

    const {
      children,
      triggers,
      loading,
      dataType = "static",
      gap,
      loaderText,
      ...componentProps
    } = component.props as any;
    const { onSubmit, ...otherTriggers } = triggers || {};
    const { style, ...otherProps } = props as any;
    const gapPx = convertSizeToPx(gap, "gap");
    const setState = useEditorTreeStore(
      (state) => state.setTreeComponentCurrentState,
    );

    const onSubmitCustom = async (e: FormEvent<any>) => {
      e.preventDefault();

      if (!isPreviewMode) {
        return;
      }

      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;

      const inputValues = useInputsStore.getState().inputValues;

      const inputsComponentsList = Object.entries(structureMapper).reduce(
        (acc, [key, value]) => {
          if (value.category === "Input") {
            acc.push(key);
          }
          return acc;
        },
        [] as string[],
      );

      const formFieldComponents = getAllComponentsByName(
        component,
        inputsComponentsList,
      );

      const submitButtonComponents = getAllComponentsByName(
        component,
        "Button",
        {
          type: "submit",
        },
      );
      const invalidComponents = formFieldComponents.filter((component) => {
        let id = component?.id!;
        if (shareableContent?.parentSuffix !== undefined) {
          id = `${component?.id!}-related-${shareableContent?.parentSuffix}`;
        }
        return (
          (inputValues[id] === "" || inputValues[id] === undefined) &&
          component?.props?.withAsterisk
        );
      });
      // re-setting error messages onSubmit
      formFieldComponents.forEach((component) => {
        updateTreeComponentAttrs({
          componentIds: [component.id!],
          attrs: { props: { hasError: false } },
          save: false,
        });
      });

      if (invalidComponents.length) {
        invalidComponents.forEach((component) => {
          updateTreeComponentAttrs({
            componentIds: [component.id!],
            attrs: {
              props: { hasError: true },
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

    const { renderData } = useRenderData({
      component,
      shareableContent,
    });

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
        {renderData({ renderTree })}
        <LoadingOverlay visible={loading} radius="sm" text={loaderText} />
      </MantineFlex>
    );
  },
);
FormComponent.displayName = "Form";

export const Form = memo(withComponentWrapper<Props>(FormComponent));
