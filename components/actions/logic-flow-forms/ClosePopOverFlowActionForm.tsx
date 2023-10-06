import { OpenPopOverFlowActionForm } from "@/components/actions/logic-flow-forms/OpenPopOverFlowActionForm";
import { OpenPopOverAction } from "@/utils/actions";
import { UseFormReturnType } from "@mantine/form";

type FormValues = Omit<OpenPopOverAction, "name">;

type Props = {
  actionName?: string;
  form: UseFormReturnType<FormValues>;
};

export const ClosePopOverFlowActionForm = (props: Props) => {
  return <OpenPopOverFlowActionForm {...props} actionName="closePopOver" />;
};
