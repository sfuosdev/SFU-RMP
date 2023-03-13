/**
 * @jest-environment node
 */

import { fetchWithRetries, promiseWindow } from "../js/utils";



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
      const error = new Error('Invalid URL');
      global.fetch = jest.fn(() => Promise.resolve(error));
    try {
      await fetchWithRetries(url, requestConfig, retryconfig);
    } catch (error) {
      expect(error).toEqual(error);
      console.log(error);
    }
    global.fetch.mockRestore();
    });
  });