import { getUserName, clearCachedUserName } from '../UserName';
import fetch from 'jest-fetch-mock';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('UserName module', () => {
  beforeEach(() => {
    fetch.resetMocks();
    localStorage.clear(); // Clear local storage before each test
  });

  it('returns cached user name if available', async () => {
    const expectedUserName = 'JohnDoe';
    // Set cached user name in localStorage
    localStorage.setItem('userName', JSON.stringify(expectedUserName));

    const result = await getUserName();
    expect(result).toBe(expectedUserName); // Expect the cached user name to be returned
  });

  it('returns user name from local storage if cached value is available', async () => {
    const expectedUserName = 'JaneDoe';
    // Set the cached value to localStorage
    localStorage.setItem('userName', JSON.stringify(expectedUserName));

    const result = await getUserName();
    expect(result).toBe(expectedUserName); // Expect the cached user name to be returned
  });

  it('fetches user name from API if not cached and stores it in local storage', async () => {
    const expectedUserName = 'JohnSmith';
    fetch.mockResponseOnce(JSON.stringify({ username: expectedUserName }));

    const result = await getUserName();
    
    expect(result).toBe(expectedUserName); // Expect the fetched user name to be returned
    expect(localStorage.getItem('userName')).toBe(JSON.stringify(expectedUserName)); // Expect user name to be stored in local storage
  });

  it('clears cached user name', () => {
    // Set a cached user name
    localStorage.setItem('userName', JSON.stringify('JohnDoe'));

    clearCachedUserName(); // Call the clear function
    
    expect(window.localStorage.getItem('userName')).toBeNull(); // Expect local storage to be cleared
  });

  it('handles errors when fetching user name', async () => {
    fetch.mockReject(new Error('API is down'));

    await expect(getUserName()).rejects.toThrow('API is down'); // Expect the function to throw an error
  });
});
