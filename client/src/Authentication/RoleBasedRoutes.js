import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom'
// import { getUserType } from '../utils/UserType.js';
import UserType from '../utils/UserType';

const RoleBasedRoutes = ({ allowedRole }) => {

  // Set the role variable based on the returned value of /getusertype
  const [role, setRole] = useState(true);

  useEffect(() => {
    UserType()
      .then((type) => {
        setRole(allowedRole === type)
      })
      .catch((error) => {
        setRole(false)
        console.error(error);
      });
  }, [role]);

  return(
      role ? <Outlet/> : <Navigate to="/NotFound"/>
  )
}

export default RoleBasedRoutes