import { Editor } from "@/components/Editor";
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  return {
    props: {
      id: query.id,
      page: query.page,
    },
  };
};

type Props = {
  id: string;
  page: string;
};

export default function PageEditor({ id, page }: Props) {
  console.log({ page, id });
  return <Editor />;
}
