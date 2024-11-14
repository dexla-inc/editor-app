import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Box,
  Loader,
  Textarea as MantineTextarea,
  TextareaProps,
} from "@mantine/core";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { ChangeEvent, forwardRef, memo } from "react";

type Props = EditableComponentMapper & TextareaProps;

const TextareaComponent = forwardRef(
  (
    {
      renderTree,
      component,
      shareableContent,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const {
      children,
      triggers,
      loading,
      bg,
      textColor,
      hideIfDataIsEmpty,
      ...restComponentProps
    } = component.props as any;

    const { placeholder = component.props?.placeholder } = component?.onLoad;

    const componentProps = { ...restComponentProps, placeholder };
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle, fontSizeStyle } = useBrandingStyles();

    const customStyle = merge({}, borderStyle, fontSizeStyle, props.style, {
      backgroundColor,
      color,
    });

    const [value, setValue] = useInputValue(
      {
        value: component?.onLoad?.value ?? "",
      },
      props.id!,
    );

    // handle changes to input field
    const handleInputChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      triggers?.onChange && triggers?.onChange(e);
    };

    return (
      <Box unstyled {...props} {...triggers}>
        <MantineTextarea
          ref={ref}
          {...componentProps}
          style={{}}
          styles={{
            root: {
              position: "relative",
              ...pick(customStyle, [
                "display",
                "width",
                "height",
                "minHeight",
                "minWidth",
              ]),
              gridArea: "1 / 1 / -1 / -1",
            },
            input: {
              ...customStyle,
              height: "100%",
              padding: "10px",
            },
          }}
          value={value}
          onChange={handleInputChange}
          rightSection={loading ? <Loader size="xs" /> : null}
          label={undefined}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
TextareaComponent.displayName = "Textarea";

export const Textarea = memo(withComponentWrapper<Props>(TextareaComponent));
