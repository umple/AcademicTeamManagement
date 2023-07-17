const CACHE_KEY = 'userName';
let cachedUserName = null;

export const getUserName = async () => {
  if (cachedUserName) {
    return cachedUserName; // Return the cached value if available
  }

  const cachedValue = localStorage.getItem(CACHE_KEY);
  if (cachedValue !== "undefined" && cachedValue !== null) {
    cachedUserName = JSON.parse(cachedValue);
    return cachedUserName;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_FLASK}/getusername`, {
      method: 'GET',
      credentials: 'include' // include cookies in the request
    })
    const data = await response.json();

    cachedUserName = data.username; // Cache the user Name
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedUserName)); // Store in local storage

    return cachedUserName;
  } catch (error) {
    console.error('Error fetching user Name:', error);
    throw error;
  }
};

export const clearCachedUserName = () => {
  cachedUserName = null; // Clear the cached value from memory
  localStorage.removeItem(CACHE_KEY); // Remove the cached value from local storage
};
