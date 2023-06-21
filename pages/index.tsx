const HomePage = () => null;

export default HomePage;

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/projects",
      permanent: false,
    },
  };
};
