import { useEffect, useState } from "react";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";

// TODO: Use property onLoad type
export const useInputValue = (onLoad: any) => {
  const { value = "" } = useComputeValue2({ onLoad: onLoad ?? {} });
  const [inputValue, setValue] = useState<any>(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return [inputValue ?? {}, setValue];
};
