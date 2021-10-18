import { createContext, useState, useContext, useEffect } from "react";

import api from "../services/api";
import { useLoading } from "./loading";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const { setLoading } = useLoading();

  api.interceptors.response.use(response => {
    return response;
  }, error => {
    if(error.response){
      if(error.response.status){
        if(error.response.status === 401 || error.response.status === 403){
          signOut();
        }
      }
    }
    return Promise.reject(error);
  });

  useEffect(() => {
    const storagedUserId = localStorage.getItem('@EstoqueLorde:userid');
    const storagedToken = localStorage.getItem('@EstoqueLorde:token');

    if(storagedToken && storagedUserId){
      setUserId(storagedUserId);
      api.defaults.headers['Authorization'] = storagedToken;
      api.defaults.headers['id_user'] = storagedUserId;
    }else{
      signOut();
    }
  }, []);


  async function signIn(username, password) {
    setLoading(true);
    try {
      const response = await api.post('session', { username, password });

      setUserId(response.data.id);
      localStorage.setItem('@EstoqueLorde:userid', response.data.id);
      localStorage.setItem('@EstoqueLorde:token', response.data.token);

      api.defaults.headers['Authorization'] = response.data.token;
      api.defaults.headers['id_user'] = response.data.id;

      setLoading(false);
      return true;

    } catch (err) {
      console.log(err);
      setLoading(false);
      return false;
    }
  }

  function signOut(){
    setUserId(null);
    localStorage.removeItem('@EstoqueLorde:userid');
    localStorage.removeItem('@EstoqueLorde:token');
  }

  return (
    <AuthContext.Provider value={{ signed: !!userId, userId: userId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(){
  return useContext(AuthContext);
};
