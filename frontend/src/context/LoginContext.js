import { createContext, useContext, useState,useEffect } from 'react';

const LoginContext = createContext();

const LoginContextProvider = ({ children }) => {
  const [login, setLogin] = useState(null);
  useEffect(() => {
    const session= localStorage.getItem('session');
    if (session) {
      setLogin(session);
    }else{
        setLogin(false)
    }
    console.log('for logincontext')
  }, []);
  return (
    <LoginContext.Provider value={[login,setLogin]}>
      { children }
    </LoginContext.Provider>
  );
};

const useLogin = () => useContext(LoginContext);
export {LoginContextProvider,useLogin}


