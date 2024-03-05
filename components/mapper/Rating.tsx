import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Rating as MantineRating, RatingProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & RatingProps;

const RatingComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const componentProps = component.props as any;

    return <MantineRating ref={ref} {...props} {...componentProps} />;
  },
);
RatingComponent.displayName = "Rating";

export const Rating = memo(
  withComponentWrapper<Props>(RatingComponent),
  isSame,
);
