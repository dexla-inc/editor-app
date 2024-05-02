import { useCallback, useEffect } from "react";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";

export const useInputValue = <T = string,>(
  { value }: any,
  componentId: string,
) => {
  const setInputValue = useInputsStore((state) => state.setInputValue);
  const inputValue: T = useInputsStore(
    useShallow((state) => state.inputValues[componentId]),
  );

  const customSetInputValue = useCallback(
    (value: T) => {
      setInputValue(componentId, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [componentId],
  );

  useEffect(() => {
    customSetInputValue(value);
  }, [customSetInputValue, value]);

  return [inputValue, customSetInputValue] as const;
};
