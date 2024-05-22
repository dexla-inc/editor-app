export type PageProps = {
  params: { id: string; page: string; name: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
