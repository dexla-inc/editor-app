import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Rating as MantineRating, RatingProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & RatingProps;

const RatingComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );

    const { triggers, ...componentProps } = component.props as any;

    const [value, setValue] = useInputValue<number>(
      {
        value: component?.onLoad?.value ?? false,
      },
      props.id!,
    );

    const handleInputChange = (newValue: number) => {
      if (!isPreviewMode) {
        return;
      }
      setValue(newValue);
      triggers?.onChange?.({ target: { value: newValue } });
    };

    return (
      <MantineRating
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        onChange={handleInputChange}
        value={value}
        data-id={props.id}
        readOnly={false}
      />
    );
  },
);
RatingComponent.displayName = "Rating";

export const Rating = memo(withComponentWrapper<Props>(RatingComponent));
