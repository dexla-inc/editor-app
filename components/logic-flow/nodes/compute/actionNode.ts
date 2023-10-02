import { actionMapper } from "@/utils/actions";
import { Node } from "reactflow";

export const compute = async (node: Node, params: any) => {
  try {
    const { action, ...formData } = node.data.form;
    const actionData = {
      ...params,
      action: { name: action, ...formData },
    };
    // @ts-ignore
    await actionMapper[action].action(actionData);
    return Promise.resolve();
  } catch (error) {
    console.log({ error });
    return Promise.reject(error);
  }
};
