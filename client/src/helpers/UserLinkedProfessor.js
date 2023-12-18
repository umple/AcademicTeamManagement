const CACHE_KEY = 'userLinkedProfessor'
let cachedUserLinkedProfessor = null

export const getUserLinkedProfessor = async () => {
  if (cachedUserLinkedProfessor) {
    return cachedUserLinkedProfessor // Return the cached value if available
  }

  const cachedValue = localStorage.getItem(CACHE_KEY)
  if (cachedValue !== 'undefined' && cachedValue !== null) {
    cachedUserLinkedProfessor = JSON.parse(cachedValue)
    return cachedUserLinkedProfessor
  }

  // check the user type from the database based on the user email
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/user/retrieve/user/linked/professor`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include' // include cookies in the request
    })

    if (response.status === 200) {
      const data = await response.json()
      console.log(data)
      cachedUserLinkedProfessor = data // Cache the user type
      localStorage.setItem(CACHE_KEY, JSON.stringify(cachedUserLinkedProfessor)) // Store in local storage

      return cachedUserLinkedProfessor
    }
  } catch (error) {
    console.error('Error fetching user type:', error)
    throw error
  }
}

export const clearCachedUserLinkedProfessor = () => {
  if (cachedUserLinkedProfessor) {
    cachedUserLinkedProfessor = null // Clear the cached value from memory
    localStorage.removeItem(CACHE_KEY) // Remove the cached value from local storage
  }
}
