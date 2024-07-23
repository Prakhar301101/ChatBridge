import { createContext, useEffect, useState } from "react";

export  const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUserName] = useState();
  const [id, setId] = useState();

  useEffect(() => {
      fetch("https://chatbridge-server.onrender.com/api/users/me", {
        method: "GET",
        credentials:'include'
      })
        .then(response => response.json())
        .then(data=>{
          setUserName(data.username);
          setId(data.id);
        })
        .catch(err=>{
          console.log('Error while fetching data',err);
        })
    },[]);


  return (
    
    <UserContext.Provider value={{ username, setUserName, id, setId}}>
      {children}
    </UserContext.Provider>
  );
}
