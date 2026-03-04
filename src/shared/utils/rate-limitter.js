import { NextResponse } from "next/server";

const cache = new Map();

// clear stale keys from cache every minute
setInterval(() => {
  const currentDate = new Date();
  for (const [key, usage] of cache) {
    if (!usage) continue;
    if (currentDate > usage.expiresAt) {
      cache.delete(key);
    }
  }
}, 60000);

export const applyRateLimiter = (req, getOptsFn) => {
  const opts = getOptsFn(req);
  const usage = cache.get(opts.key);

  if (!usage) {
    cache.set(opts.key, {
      tries: 1,
      maxTries: opts.maxTries,
      expiresAt: opts.expiresAt,
    });
    return;
  }

  const currentDate = new Date();
  const retryAfter = usage.expiresAt.getTime() - currentDate.getTime();
  const canProceed = usage.tries < opts.maxTries && retryAfter >= 0;

  if (canProceed) {
    cache.set(opts.key, {
      ...usage,
      tries: usage.tries + 1,
    });
    return;
  }

  if (retryAfter <= 0) {
    cache.set(opts.key, {
      tries: 1,
      maxTries: opts.maxTries,
      expiresAt: opts.expiresAt,
    });
    return;
  }

  return NextResponse.json(
    { error: { message: "Too many requests" } },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    },
  );
};

const getIP = (req) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

export const rateLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 100,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  }));

export const authRateLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 5,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  }));

export const signinRateLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 5,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  }));

export const signupRateLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 5,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  }));

export const otpRequestLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 6,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  }));

export const otpVerificationLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 6,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  }));

export const resetPasswordLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 6,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  }));

export const deleteAccountLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 5,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  }));

export const changePasswordLimiter = (req) =>
  applyRateLimiter(req, (req) => ({
    key: `${req.method}.${new URL(req.url).pathname}.${getIP(req)}`,
    maxTries: 5,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  }));
