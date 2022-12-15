import React, { useCallback, useEffect, useState } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemaningTime = (expirationTime) =>{
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration 
}

const retriveStoredToken = () =>{
  const storedToken = localStorage.getItem('token')
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemaningTime(storedExpirationDate)

  if(remainingTime <= 3600){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null
  }

  return {
    token:storedToken,
    duration:remainingTime
  }
}

export const AuthContextProvider = (props) => {

  const tokendata = retriveStoredToken();
  let initialToken;
  if(tokendata){
    initialToken = tokendata.token;

  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;



  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime')

    if(logoutTimer){
      clearTimeout(logoutTimer);
    }
  },[]);


  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token',token)
    localStorage.setItem('expirationTime', expirationTime)

    const remainingTime = calculateRemaningTime(expirationTime)

   logoutTimer =  setTimeout(logoutHandler, remainingTime)
  };

  useEffect(()=>{
    if(tokendata){
      logoutTimer =  setTimeout(logoutHandler, tokendata.duration)

    }
  },[tokendata, logoutHandler])

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;