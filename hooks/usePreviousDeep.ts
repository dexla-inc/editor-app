import isEqual from "lodash.isequal";
import { useRef, useEffect } from "react";

export function usePreviousDeep<T>(value: T): T | undefined {
  const ref = useRef<T>();

  const isDifferent = !isEqual(value, ref.current);

  useEffect(() => {
    ref.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDifferent]);

  return ref.current;
}
