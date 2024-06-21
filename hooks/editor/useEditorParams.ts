import { useParams } from "next/navigation";

type Params = {
  id: string;
  page: string;
  dataSourceId: string;
  endpoint: string;
};

export function useEditorParams(): Params {
  const params = useParams<Params>();

  if (!params) {
    throw new Error("Params are null, but were expected to be non-null.");
  }

  return params;
}
