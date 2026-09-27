import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

interface RateLimitOptions {
  windowMs: number; // Window frame in milliseconds
  max: number; // Max requests per window
  message?: string;
  keyGenerator?: (req: Request) => string;
}

const clientLimits = new Map<string, RateLimitStore>();

// Auto purge old rate limit keys periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of clientLimits.entries()) {
    if (now > record.resetTime) {
      clientLimits.delete(key);
    }
  }
}, 60000).unref?.();

/**
 * Creates an in-memory Rate Limiting middleware for express routes to maintain server stability
 */
export function rateLimiter(options: RateLimitOptions) {
  const {
    windowMs = 60 * 1000,
    max = 100,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req: Request) => {
      // Use IP or auth token header
      const forwarded = req.headers['x-forwarded-for'];
      const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress) || '127.0.0.1';
      return `${ip}:${req.baseUrl || req.path}`;
    },
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const now = Date.now();
    let record = clientLimits.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      clientLimits.set(key, record);
    } else {
      record.count++;
    }

    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (record.count > max) {
      res.setHeader('Retry-After', resetSeconds);
      res.status(429).json({
        success: false,
        message,
        retryAfter: resetSeconds,
      });
      return;
    }

    next();
  };
}

// Pre-configured rate limiters for load balancing
export const apiRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 180, // 180 requests/min per IP
  message: 'System load protection: API rate limit exceeded. Please slow down.',
});

export const strictActionLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 40, // 40 actions/min (e.g. swipes, OTP requests)
  message: 'Too many match actions submitted in short interval. Please wait a moment.',
});
