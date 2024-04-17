import { useCallback, useEffect, useState } from "react";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";

export const useInputValue = ({ value }: any, componentId: string) => {
  const setInputValue = useInputsStore((state) => state.setInputValue);
  const inputValue = useInputsStore(
    useShallow((state) => state.inputValues[componentId]),
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

  return [inputValue ?? "", customSetInputValue];
};

// TODO: Delete function above once proved this works
export function useGenericInputValue<T>(
  _: { value: T },
  componentId: string,
  converter?: (value: any) => T,
): [T, (value: T) => void] {
  const setInputValue = useInputsStore((state) => state.setInputValue);
  const rawValue = useInputsStore(
    useShallow((state) => state.inputValues[componentId] as T),
  );

  const inputValue = converter ? converter(rawValue) : (rawValue as T);

  const customSetInputValue = useCallback(
    (value: T) => {
      setInputValue(componentId, value);
    },
    [setInputValue, componentId],
  );

  useEffect(() => {
    customSetInputValue(inputValue);
  }, [customSetInputValue, inputValue]);

  return [inputValue, customSetInputValue];
}
