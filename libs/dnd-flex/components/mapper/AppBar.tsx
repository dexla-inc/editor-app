import { EditableComponentMapper } from "@/utils/editor";
import { forwardRef, memo } from "react";
import { Grid, GridProps } from "./Grid";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & GridProps; // Using GridProps instead of FlexProps

const AppBarComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props) => {
    return <Grid renderTree={renderTree} component={component} {...props} />;
  },
);
AppBarComponent.displayName = "AppBar";

export const AppBar = memo(withComponentWrapper<Props>(AppBarComponent));
