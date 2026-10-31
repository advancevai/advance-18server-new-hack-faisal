export const PG_URL = 'https://advance-admin.lovable.app';
export const PG_KEY = 'pgk_live_qMS4Y8HdnyYvayl0CNPgu63dabpdipWH';

export interface PassGateVerifyResponse {
  valid: boolean;
  token?: string;
  reason?: string;
}

export async function verifyPassGate(password: string): Promise<{
  valid: boolean;
  token?: string;
  message: string;
}> {
  const cleanPass = password.trim();
  if (!cleanPass) {
    return { valid: false, message: 'Please enter a password' };
  }

  // Strictly verify via PassGate API - No hardcoded/demo passwords allowed
  try {
    const res = await fetch(`${PG_URL}/api/public/v1/verify`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': PG_KEY,
      },
      body: JSON.stringify({ password: cleanPass }),
    });

    const data: PassGateVerifyResponse = await res.json();
    if (data.valid) {
      if (data.token) {
        localStorage.setItem('pg_token', data.token);
      }
      return { valid: true, token: data.token, message: '' };
    }

    let message = 'Wrong password';
    if (data.reason === 'rate_limited') {
      message = 'Too many attempts. Try later.';
    } else if (data.reason === 'ip_blocked') {
      message = 'Access from your network is blocked.';
    } else if (data.reason === 'origin_not_allowed') {
      message = 'This site is not allowed for this key.';
    } else if (data.reason === 'invalid_api_key') {
      message = 'API key is wrong or revoked.';
    }

    return { valid: false, message };
  } catch {
    return {
      valid: false,
      message: 'Cannot reach the PassGate server. Is the app published?',
    };
  }
}

export async function checkPassGateSession(): Promise<boolean> {
  const token = localStorage.getItem('pg_token');
  if (!token) return false;

  try {
    const res = await fetch(`${PG_URL}/api/public/v1/session`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': PG_KEY,
      },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (data.valid) {
      return true;
    } else {
      localStorage.removeItem('pg_token');
      return false;
    }
  } catch {
    localStorage.removeItem('pg_token');
    return false;
  }
}
