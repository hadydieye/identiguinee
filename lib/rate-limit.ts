const attempts = new Map<string, { count: number; firstAttempt: number }>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const resetIn = Math.ceil((record.firstAttempt + WINDOW_MS - now) / 1000 / 60);
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count, resetIn: 0 };
}

export function resetRateLimit(ip: string) {
  attempts.delete(ip);
}
