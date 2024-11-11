import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, Rating as MantineRating, RatingProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & RatingProps;

const RatingComponent = forwardRef(
  (
    { component, shareableContent, grid: { ChildrenWrapper }, ...props }: Props,
    ref,
  ) => {
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
      <Box unstyled {...props} {...triggers}>
        <MantineRating
          ref={ref}
          {...componentProps}
          onChange={handleInputChange}
          value={value}
          readOnly={false}
          styles={{
            root: {
              width: "100%",
              height: "100%",
              display: "flex",
              gridArea: "1 / 1 / -1 / -1",
            },
          }}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
RatingComponent.displayName = "Rating";

export const Rating = memo(withComponentWrapper<Props>(RatingComponent));
