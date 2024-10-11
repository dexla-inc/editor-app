import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";
import { GoogleFont, getGoogleFonts } from "@/utils/getGoogleFonts";

const cacheTime = 60 * 60 * 1000; // 60 minutes

export const useGoogleFontsQuery = (family?: string) => {
  const queryKey = ["fonts", family];

  const queryResult = useQuery<GoogleFont[], Error>({
    queryKey: queryKey,
    queryFn: () => getGoogleFonts(),
    staleTime: cacheTime,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
