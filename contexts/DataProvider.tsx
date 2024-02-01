import { createContext, useContext } from "react";

type DataProviderProps = {
  children: React.ReactNode;
};

export const DataContext = createContext({});

export const DataProvider = ({ children }: DataProviderProps) => {
  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  return useContext(DataContext);
};
