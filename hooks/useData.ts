import { Component } from "@/utils/editor";
import get from "lodash.get";
import { useVariableStore } from "@/stores/variables";
import { useBindingPopover } from "@/hooks/useBindingPopover";

type GetValueProps = {
  component: Component;
  shareableContent: any;
};

export const useData = () => {
  const { getSelectedVariable } = useBindingPopover();

  const getValue = (
    field: string,
    { component, shareableContent }: GetValueProps,
  ) => {
    const fieldConfig = component.onLoad?.[field] ?? {};
    const value =
      fieldConfig.dataType === "dynamic"
        ? get(shareableContent, `data.${fieldConfig.value}`, fieldConfig.value)
        : get(fieldConfig, "value", component.props?.[field]);

    return getSelectedVariable(value);
  };

  const getObjectAndArrayKeys = (obj: any, prefix = "") => {
    let keys: string[] = [];

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === "object" && obj[key] !== null) {
          keys.push(newKey);

          if (!Array.isArray(obj[key])) {
            keys = keys.concat(getObjectAndArrayKeys(obj[key], newKey));
          }
        }
      }
    }

    return keys;
  };

  return {
    getValue,
    getObjectAndArrayKeys,
  };
};
