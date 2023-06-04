import { Loader } from "@mantine/core";

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/projects/new",
      permanent: false,
    },
  };
};

export default function Home() {
  return <Loader />;
}
