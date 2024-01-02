import { isMatchingUrl } from "@/pages/[page]";
import { getByDomain } from "@/requests/projects/queries-noauth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useCheckIfIsLive = () => {
  const router = useRouter();

  const url = typeof window !== "undefined" ? window.location.host : "";
  let initialIsLive = true;

  if (
    router?.asPath === "/[page]" ||
    isMatchingUrl(url) ||
    url.endsWith(".localhost:3000")
  ) {
    initialIsLive = true;
  } else {
    initialIsLive = false;
  }

  const [isLive, setIsLive] = useState(initialIsLive);

  useEffect(() => {
    const setLiveIfHasCustomDomain = async () => {
      try {
        const project = await getByDomain(url);
        if (project.id) setIsLive(!!project.id);
      } catch (error) {
        console.error("Error checking if live:", error);
      }
    };

    setLiveIfHasCustomDomain();
    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.state?.pathname]);

  return isLive;
};
