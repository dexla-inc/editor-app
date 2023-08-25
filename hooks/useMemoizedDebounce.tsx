import { useEffect, useRef } from "react";

export const useMemoizedDebounce = (callback: any, delay: number) => {
  const latestCallback = useRef(callback);
  const latestTimeout = useRef(1);

  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  return () => {
    if (latestTimeout.current) {
      clearTimeout(latestTimeout.current);
    }

    latestTimeout.current = window.setTimeout(
      () => latestCallback.current(),
      delay
    );
  };
};
