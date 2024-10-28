import { getUserEmail, clearCachedUserEmail } from '../UserEmail';

describe('UserEmail', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any cached user email
    clearCachedUserEmail();
  });

  it('should return cached user email if available', async () => {
    // Set up the local storage with a cached user email
    const email = 'test@example.com';
    localStorage.setItem('userEmail', JSON.stringify(email));

    const result = await getUserEmail();

    expect(result).toBe(email); // Expect the cached email to be returned
  });

  it('should fetch user email from API if not cached', async () => {
    const mockResponse = { userEmail: 'fetch@example.com' };

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse)
      })
    );

    const result = await getUserEmail();

    expect(result).toBe(mockResponse.userEmail); // Expect the fetched email to be returned
    expect(localStorage.getItem('userEmail')).toBe(JSON.stringify(mockResponse.userEmail)); // Expect it to be cached in local storage
  });

  it('should handle API fetch errors gracefully', async () => {
    // Mock the fetch function to reject the promise
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch error')));

    await expect(getUserEmail()).rejects.toThrow('Fetch error'); // Expect an error to be thrown
  });

  it('should clear cached user email', () => {
    // Set the cached value
    localStorage.setItem('userEmail', JSON.stringify('clear@example.com'));
    clearCachedUserEmail();

    // Check that the cached value is cleared
    expect(localStorage.getItem('userEmail')).toBe(null);
  });

  afterEach(() => {
    // Restore the original fetch function after each test
    jest.restoreAllMocks();
  });
});
