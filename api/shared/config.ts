import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { Platform } from 'react-native';
import classifyPlugin from 'wtf-plugin-classify';
import summaryPlugin from 'wtf-plugin-summary';
import wtf from 'wtf_wikipedia';

// Apply wtf plugins globally
wtf.extend(summaryPlugin);
wtf.extend(classifyPlugin);

// Wikipedia API configuration
export const WIKIPEDIA_API_CONFIG = {
  API_USER_AGENT: 'WikipediaExpo/0.1 (bryce.hoehn@mailbox.org)',
  BASE_URL: 'https://en.wikipedia.org/w/api.php',
  WIKIMEDIA_BASE_URL: 'https://api.wikimedia.org',
  REST_API_BASE_URL: 'https://en.wikipedia.org/api/rest_v1',
};

// Set headers for Wikipedia API
const headers: Record<string, string> = {
  'Accept': 'application/json',
  'Api-User-Agent': WIKIPEDIA_API_CONFIG.API_USER_AGENT
};

if (Platform.OS !== 'web') {
  headers['User-Agent'] = WIKIPEDIA_API_CONFIG.API_USER_AGENT;
}

// Optimized Axios instance for Wikipedia APIs
export const axiosInstance: AxiosInstance = axios.create({
  // Default to REST API base URL for better performance
  baseURL: WIKIPEDIA_API_CONFIG.REST_API_BASE_URL,
  headers,
});

// Delay helper
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Simple concurrency limiter
const createConcurrencyLimiter = (maxConcurrent: number = 5) => {
  let currentConcurrent = 0;
  const queue: (() => void)[] = [];

  const processQueue = () => {
    if (queue.length > 0 && currentConcurrent < maxConcurrent) {
      const next = queue.shift();
      if (next) {
        currentConcurrent++;
        next();
      }
    }
  };

  return {
    acquire: () => new Promise<void>((resolve) => {
      queue.push(() => resolve());
      processQueue();
    }),
    release: () => {
      currentConcurrent--;
      processQueue();
    },
  };
};

// REST API limiter: <5 concurrent requests, <10 requests per second
const restApiLimiter = createConcurrencyLimiter(4);

// Rate limiting interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Use REST API limiter by default
    await restApiLimiter.acquire();
    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    restApiLimiter.release();
    return response;
  },
  async (error: unknown) => {
    restApiLimiter.release();

    if (isAxiosError(error) && error.response?.status === 429) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10) * 1000;
      console.warn(`Rate limited by Wikipedia. Retrying after ${retryAfter}ms...`);
      await delay(retryAfter);
      return axiosInstance.request(error.config as AxiosRequestConfig);
    }
    return Promise.reject(error);
  }
);

// Optimized concurrent fetching
export const fetchConcurrently = async <T, R>(
  items: T[],
  requestFn: (item: T) => Promise<R>
): Promise<R[]> => {
  const results = await Promise.allSettled(
    items.map(item => requestFn(item))
  );

  const fulfilledResults: R[] = [];
  
  for (const result of results) {
    if (result.status === 'fulfilled') {
      fulfilledResults.push(result.value);
    }
  }
  
  return fulfilledResults;
};

// Export wtf with plugins
export const wtfWithPlugins: typeof wtf = wtf;
