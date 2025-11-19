/**
 * API Client utilities for handling Server Actions with better error handling and type safety
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Wrapper for Server Actions that provides consistent error handling
 */
export async function handleServerAction<T>(
  action: () => Promise<T>,
  errorMessage = "An error occurred"
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.error(`Server Action Error:`, error);

    if (error instanceof Error) {
      throw new APIError(error.message || errorMessage);
    }

    throw new APIError(errorMessage);
  }
}

/**
 * Result type for operations that may fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Safe wrapper for Server Actions that returns Result type instead of throwing
 */
export async function safeServerAction<T>(
  action: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    console.error(`Server Action Error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Retry wrapper for Server Actions with exponential backoff
 */
export async function retryServerAction<T>(
  action: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new APIError(
    `Failed after ${maxRetries} retries: ${lastError?.message}`,
    500,
    "RETRY_FAILED"
  );
}

/**
 * Batch wrapper for multiple Server Actions
 */
export async function batchServerActions<T>(
  actions: Array<() => Promise<T>>
): Promise<Result<T>[]> {
  return Promise.all(actions.map((action) => safeServerAction(action)));
}

/**
 * Debounce wrapper for Server Actions (useful for search)
 */
export function debounceServerAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  delayMs = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let pendingResolve: ((value: any) => void) | null = null;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Reject previous pending promise
    if (pendingResolve) {
      pendingResolve(null);
    }

    return new Promise((resolve) => {
      pendingResolve = resolve;

      timeoutId = setTimeout(async () => {
        try {
          const result = await action(...args);
          resolve(result);
        } catch (error) {
          throw error;
        } finally {
          pendingResolve = null;
          timeoutId = null;
        }
      }, delayMs);
    });
  };
}

/**
 * Cache wrapper for Server Actions with TTL
 */
export function cacheServerAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  ttlMs = 60000 // 1 minute default
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const cache = new Map<string, { data: any; expires: number }>();

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = JSON.stringify(args);
    const now = Date.now();

    // Check cache
    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      return cached.data;
    }

    // Fetch and cache
    const data = await action(...args);
    cache.set(key, { data, expires: now + ttlMs });

    // Cleanup expired entries
    for (const [cacheKey, value] of cache.entries()) {
      if (value.expires <= now) {
        cache.delete(cacheKey);
      }
    }

    return data;
  };
}
