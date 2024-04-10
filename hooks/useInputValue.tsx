import { useCallback, useEffect } from "react";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";
import { useInputsStore } from "@/stores/inputs";
import { memoize } from "proxy-memoize";

export const useInputValue = (onLoad: any, componentId: string) => {
  const { value = "" } = useComputeValue2({ onLoad: onLoad ?? {} });
  const setInputValue = useInputsStore((state) => state.setInputValue);
  const inputValue = useInputsStore(
    memoize((state) => state.inputValues[componentId]),
  );

  const customSetInputValue = useCallback(
    (value: string) => {
      setInputValue(componentId, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [componentId],
  );

  useEffect(() => {
    customSetInputValue(value);
  }, [customSetInputValue, value]);

  return [inputValue ?? {}, customSetInputValue];
};
