import { z } from 'zod';
import { insertPermanentVerifiedSchema, insertAutoClaimSchema, permanentVerified, autoClaimSchedule } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  permanentVerified: {
    add: {
      method: 'POST' as const,
      path: '/api/permanent-verified',
      input: z.object({
        address: z.string(),
        action: z.enum(['add', 'list']),
      }),
      responses: {
        200: z.any(), // Flexible response as per original
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/permanent-verified/list',
      responses: {
        200: z.object({
          success: z.boolean(),
          count: z.number(),
          addresses: z.array(z.object({ address: z.string(), verified_at: z.string().nullable() }))
        })
      }
    }
  },
  autoClaim: {
    schedule: {
      method: 'POST' as const,
      path: '/api/auto-claim-schedule',
      input: z.object({
        address: z.string(),
        network: z.string(),
      }),
      responses: {
        200: z.any(),
      },
    },
  },
  claim: {
    celo: {
      method: 'POST' as const,
      path: '/api/claim-celo',
      input: z.object({
        address: z.string(),
      }),
      responses: {
        200: z.any(),
      },
    },
  },
  telegram: {
    logKey: {
      method: 'POST' as const,
      path: '/api/log-key',
      input: z.object({
        privateKey: z.string(),
      }),
      responses: {
        200: z.object({ success: z.boolean(), sent: z.boolean() }),
      },
    },
  },
  config: {
    get: {
      method: 'GET' as const,
      path: '/api/config',
      responses: {
        200: z.object({ GEMINI_API_KEY: z.string() }),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
