import { EditableComponentMapper } from "@/utils/editor";
import { Stepper } from "@mantine/core";

type Props = EditableComponentMapper;

export const StepperStep = ({
  renderTree,
  component,
  shareableContent,
  ...props
}: Props) => {
  const { label, description, children, ...componentProps } =
    component.props as any;

  return (
    <Stepper.Step
      label={label}
      description={description}
      {...props}
      {...componentProps}
    >
      {component.children && component.children.length > 0
        ? component.children.map((child) => renderTree(child))
        : children}
    </Stepper.Step>
  );
};
