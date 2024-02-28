import { actionMapper } from "@/utils/actions";
import { Node } from "reactflow";

function transformObject(input: Record<string, any>): Record<string, any> {
  const output: Record<string, any> = {};

  for (const key in input) {
    const keys = key.split(".");
    let currentLevel = output;

    for (let i = 0; i < keys.length - 1; i++) {
      const currentKey = keys[i];
      if (!currentLevel[currentKey]) {
        currentLevel[currentKey] = {};
      }
      currentLevel = currentLevel[currentKey];
    }

    const lastKey = keys[keys.length - 1];
    currentLevel[lastKey] = input[key];
  }

  return output;
}

export const compute = async (node: Node, params: any) => {
  try {
    const { action, ...formData } = node.data.form;

    const formDataTransformed = transformObject(formData);

    const actionData = {
      ...params,
      action: { name: action, ...formDataTransformed },
    };
    // @ts-ignore
    const result = await actionMapper[action].action(actionData);

    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};
