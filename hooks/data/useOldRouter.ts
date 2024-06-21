import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

export const useOldRouter = () => {
  const searchParams = useSearchParams();
  const asPath = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams?.toString());
  const queryParams = useParams<Record<string, string>>();
  const query: Record<string, string> = { ...queryParams };

  for (const q of params.entries()) {
    query[q[0]] = q[1];
  }

  return {
    asPath,
    query,
    ...router,
  };
};
