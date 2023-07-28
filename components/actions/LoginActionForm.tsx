import { APICallActionForm } from "@/components/actions/APICallActionForm";

type Props = {
  id: string;
};

export const LoginActionForm = (props: Props) => {
  return <APICallActionForm {...props} actionName="login" />;
};
