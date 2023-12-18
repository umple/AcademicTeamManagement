const CACHE_KEY = 'userEmail'
let cachedUserEmail = null

export const getUserEmail = async () => {
  if (cachedUserEmail) {
    return cachedUserEmail // Return the cached value if available
  }

  const cachedValue = localStorage.getItem(CACHE_KEY)
  if (cachedValue !== 'undefined' && cachedValue !== null) {
    cachedUserEmail = JSON.parse(cachedValue)
    return cachedUserEmail
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/getuseremail`, {
      method: 'GET',
      credentials: 'include' // include cookies in the request
    })
    const data = await response.json()

    cachedUserEmail = data.userEmail // Cache the user type
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedUserEmail)) // Store in local storage
    return cachedUserEmail
  } catch (error) {
    console.error('Error fetching user email:', error)
    throw error
  }
}

export const clearCachedUserEmail = () => {
  if (cachedUserEmail) {
    cachedUserEmail = null // Clear the cached value from memory
    localStorage.removeItem(CACHE_KEY) // Remove the cached value from local storage
  }
}
