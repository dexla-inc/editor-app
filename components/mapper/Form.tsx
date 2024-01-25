import { isSame } from "@/utils/componentComparison";
import {
  Component,
  debouncedTreeUpdate,
  getAllComponentsByName,
  updateInputFieldsWithFormData,
} from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  FormEvent,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { componentMapper } from "@/utils/componentMapper";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { useEndpoint } from "@/hooks/useEndpoint";
import get from "lodash.get";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & FlexProps;

const FormComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, triggers, loading, dataType, ...componentProps } =
      component.props as any;
    const { onSubmit, ...otherTriggers } = triggers;
    const form = useForm();
    const updateTreeComponent = useEditorStore(
      (state) => state.updateTreeComponent,
    );
    const getInputValue = useInputsStore((state) => state.getValue);
    const { endpointId, resultsKey, binds, staleTime } = component.onLoad ?? {};
    const [data, setData] = useState(component.props?.data ?? []);

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

      const invalidComponents = getAllComponentsByName(
        component,
        validatableComponentsList,
        { withAsterisk: true },
      ).filter(
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
        return triggers.onSubmit && triggers.onSubmit(e);
      }
    };

    const onChangeField = (e: any) => {
      form.setFieldValue(e.target.name, e.target.value);
    };

    const { data: response } = useEndpoint({
      endpointId,
      requestSettings: { binds, dataType, staleTime },
    });

    useEffect(() => {
      if (endpointId) {
        if (!response) {
          setData([]);
        } else {
          const result = get(response, resultsKey, response);
          setData(result);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultsKey, response, endpointId]);

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
