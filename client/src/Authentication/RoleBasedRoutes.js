import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom'
import { getUserType } from '../Utils/UserType';

const RoleBasedRoutes = ({ allowedRole }) => {

  // Set the role variable based on the returned value of /getusertype
  const [role, setRole] = useState(true);

  useEffect(() => {
    getUserType()
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