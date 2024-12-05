// Based on user role, this will point user in the correct route.
// If the role matches, it renders the corresponding child components (via Outlet).
// Otherwise, it redirects the user to a "Not Found" page.
import { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getUserType } from '../helpers/UserType'

const RoleBasedRoutes = ({ allowedRole }) => {
  // Set the role variable based on the returned value of /getusertype
  const [role, setRole] = useState(true)

  useEffect(() => {
    getUserType()
      .then((type) => {
        setRole(allowedRole === type)
      })
      .catch((error) => {
        setRole(false)
        console.error(error)
      })
  }, [role])

  return (
    role ? <Outlet/> : <Navigate to="/NotFound"/>
  )
}

export default RoleBasedRoutes
