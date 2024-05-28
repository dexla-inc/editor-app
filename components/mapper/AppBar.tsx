import { EditableComponentMapper } from "@/utils/editor";
import { memo } from "react";
import { Grid, GridProps } from "./Grid";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & GridProps; // Using GridProps instead of FlexProps

const AppBarComponent = ({
  renderTree,
  shareableContent,
  component,
  ...props
}: Props) => {
  return <Grid renderTree={renderTree} component={component} {...props} />;
};

export const AppBar = memo(withComponentWrapper<Props>(AppBarComponent));
