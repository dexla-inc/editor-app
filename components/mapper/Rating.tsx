import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Rating as MantineRating, RatingProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & RatingProps;

const RatingComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const componentProps = component.props as any;

    return <MantineRating ref={ref} {...props} {...componentProps} />;
  },
);
RatingComponent.displayName = "Rating";

export const Rating = memo(
  withComponentWrapper<Props>(RatingComponent),
  isSame,
);
