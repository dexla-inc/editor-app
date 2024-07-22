import { useCallback, useEffect } from "react";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";

export const useInputValue = <T = string,>(
  { value }: { value: T },
  componentId: string,
) => {
  const setInputValue = useInputsStore((state) => state.setInputValue);
  const inputValue: T = useInputsStore(
    useShallow((state) => state.inputValues[componentId]),
  );

  const customSetInputValue = useCallback(
    (newValue: T) => {
      setInputValue(componentId, newValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [componentId],
  );

  useEffect(() => {
    let newValue = value;

    if (typeof value !== "boolean") {
      if (typeof value === "object" && inputValue) {
        newValue = inputValue;
      } else {
        newValue = value || inputValue;
      }
    }

    customSetInputValue(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customSetInputValue, value]);

  return [inputValue, customSetInputValue] as const;
};
