import { OpenModalFlowActionForm } from "@/components/actions/logic-flow-forms/OpenModalFlowActionForm";
import { OpenModalAction } from "@/utils/actions";
import { UseFormReturnType } from "@mantine/form";

type FormValues = Omit<OpenModalAction, "name">;

type Props = {
  actionName?: string;
  form: UseFormReturnType<FormValues>;
};

export const CloseModalFlowActionForm = (props: Props) => {
  return <OpenModalFlowActionForm {...props} actionName="closeModal" />;
};
