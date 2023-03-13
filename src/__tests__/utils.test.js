import { fetchWithRetries } from "../js/utils";

describe('fetchWithRetries', () => {
    test('returns a valid response when given a valid URL', async () => {
      const url = 'https://google.com';
      const requestConfig = {};
      const retryconfig = { retry: 3, interval: 500 };
      const response = await fetchWithRetries(url, requestConfig, retryconfig);
      expect(response.ok).toBe(true);
    });
  
    test('throws an error when given an invalid URL', async () => {
      const url = 'https://google.com/invalid';
      const requestConfig = {};
      const retryconfig = { retry: 3, interval: 500 };
      await expect(fetchWithRetries(url, requestConfig, retryconfig)).rejects.toThrow();
    });
  });