import { OpenDrawerFlowActionForm } from "@/components/actions/logic-flow-forms/OpenDrawerFlowActionForm";
import { OpenDrawerAction } from "@/utils/actions";
import { UseFormReturnType } from "@mantine/form";

type FormValues = Omit<OpenDrawerAction, "name">;

type Props = {
  actionName?: string;
  form: UseFormReturnType<FormValues>;
};

export const CloseDrawerFlowActionForm = (props: Props) => {
  return <OpenDrawerFlowActionForm {...props} actionName="closeDrawer" />;
};
