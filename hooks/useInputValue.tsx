import { useEffect, useState } from "react";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";

// TODO: Use property onLoad type
export const useInputValue = (onLoad: any) => {
  const inputValue = useComputeValue2({ onLoad });
  const [value, setValue] = useState(inputValue);

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  return [value, setValue];
};
