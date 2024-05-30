import { usePropelAuthStore } from "@/stores/propelAuth";
import { useEffect, useState } from "react";
import { usePropelAuth } from "./usePropelAuth";

const useCheckAccess = (projectId: string) => {
  const checkHasAccess = usePropelAuthStore((state) => state.checkHasAccess);
  const { auth } = usePropelAuth();
  const [status, setStatus] = useState<
    "authorised" | "unauthorised" | "loading"
  >("loading");

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Refresh the token to ensure we have the latest one with the correct project ID
        const hasAccess = checkHasAccess(auth, projectId);
        if (hasAccess) {
          setStatus("authorised");
        } else {
          setStatus("unauthorised");
        }
      } catch (error) {
        console.error("Error refreshing token or checking access:", error);
        setStatus("unauthorised");
      }
    };

    verifyAccess();
  }, [projectId, checkHasAccess]);

  return status;
};

export default useCheckAccess;
