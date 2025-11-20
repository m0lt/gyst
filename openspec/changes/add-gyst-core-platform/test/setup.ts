/**
 * Vitest Setup File
 *
 * This file runs before all tests to set up the testing environment.
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Extend Vitest's expect with jest-dom matchers
expect.extend({});

// Mock environment variables if not set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
}

// Suppress console errors in tests (optional)
// global.console = {
//   ...console,
//   error: vi.fn(),
//   warn: vi.fn(),
// };
