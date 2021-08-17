import { createContext, useState, useContext } from "react";

const LoadingContext = createContext({});


export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(){
  return useContext(LoadingContext);
};