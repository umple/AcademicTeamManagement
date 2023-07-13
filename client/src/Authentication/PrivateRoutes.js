import { useState, } from 'react';
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {

  // Set the authentication variable based on the returned value of /checksession
  const [auth, setAuth] = useState(true);

  // Check if user exists in the session
  fetch(`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_FLASK}/checksession`, {
    method: 'GET',
    credentials: 'include' // include cookies in the request
  })
    .then(response => response.json())
    .then(data => data.error ? setAuth(false) : setAuth(true)); // if error exists, that means the user is not logged in yet
    
    return(
        auth ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes