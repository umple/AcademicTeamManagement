import { useState, } from 'react';
import { Outlet, Navigate } from 'react-router-dom'

const RoleBasedRoutes = ({ allowedRole }) => {

  // Set the role variable based on the returned value of /getusertype
  const [role, setRole] = useState(true);

  // Check if user exists in the session
  fetch(`http://localhost:${process.env.REACT_APP_FLASK}/getusertype`, {
    method: 'GET',
    credentials: 'include' // include cookies in the request
  })
    .then(response => response.json())
    .then(data => data.error ? setRole(false) : setRole(allowedRole === data.userType)); // if error exists, that means the user is not logged in yet
    
    return(
        role ? <Outlet/> : <Navigate to="/NotFound"/>
    )
}

export default RoleBasedRoutes