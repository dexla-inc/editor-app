import { APICallAction, LoginAction } from "@/utils/actions";
import { UseFormReturnType } from "@mantine/form";
import { APICallFlowActionForm } from "./APICallFlowActionForm";

type FormValues = Omit<APICallAction | LoginAction, "name" | "datasource">;

type Props = {
  actionName?: string;
  form: UseFormReturnType<FormValues>;
};

export const LoginFlowActionForm = (props: Props) => {
  return <APICallFlowActionForm {...props} actionName="login" />;
};
