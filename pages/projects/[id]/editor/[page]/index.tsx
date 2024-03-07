import Editor from "@/components/Editor";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { GetServerSidePropsContext } from "next";
import { memo } from "react";

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

const PageEditor = ({ id, page }: Props) => {
  return <Editor key={page} pageId={page} projectId={id} />;
};

export default withPageOnLoad(memo(PageEditor));
