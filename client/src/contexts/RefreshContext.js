import React, { createContext, useState } from 'react'

// RefreshContext.js
export const RefreshContext = createContext()

export const RefreshProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  return (
    <RefreshContext.Provider value={{ refreshTrigger, setRefreshTrigger }}>
      {children}
    </RefreshContext.Provider>
  )
}
