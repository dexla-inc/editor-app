import { isMatchingUrl } from "@/pages/[page]";
import { getByDomain } from "@/requests/projects/queries";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useCheckIfIsLive = () => {
  const router = useRouter();
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const chekcIfIsLive = async () => {
      // @ts-ignore
      if (router?.state?.pathname === "/[page]") {
        setIsLive(true);
      } else {
        let id = "";
        const url = window?.location.host;
        if (isMatchingUrl(url!) || url?.endsWith(".localhost:3000")) {
          id = url?.split(".")[0] as string;
        } else {
          const project = await getByDomain(url!);
          id = project.id;
        }

        if (id) {
          setIsLive(true);
        }
      }
    };

    chekcIfIsLive();
    // Disabling the lint here because we only want to do the check once on the parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLive;
};
