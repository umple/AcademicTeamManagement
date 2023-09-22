const CACHE_KEY = 'userType';
let cachedUserType = null;

export const getUserType = async () => {
  if (cachedUserType) {
    return cachedUserType; // Return the cached value if available
  }

  const cachedValue = localStorage.getItem(CACHE_KEY);
  if (cachedValue !== "undefined" && cachedValue !== null) {
    cachedUserType = JSON.parse(cachedValue);
    return cachedUserType;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/getusertype`, {
      method: 'GET',
      credentials: 'include' // include cookies in the request
    })
    const data = await response.json();

    cachedUserType = data.userType; // Cache the user type
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedUserType)); // Store in local storage

    return cachedUserType;
  } catch (error) {
    console.error('Error fetching user type:', error);
    throw error;
  }
};

export const clearCachedUserType = () => {
  cachedUserType = null; // Clear the cached value from memory
  localStorage.removeItem(CACHE_KEY); // Remove the cached value from local storage
};