// Système d'auth simple par sessions en mémoire
// En production, utiliser une DB persistante

const USERS: Record<string, { password: string; name: string }> = {
  'herve@herve-affiches.fr': { password: 'herve2024', name: 'Hervé' },
  'admin@agence-kano.fr': { password: 'kano2024', name: 'Kano Admin' },
};

interface Session {
  email: string;
  name: string;
  expires: number;
}

const sessions = new Map<string, Session>();

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function verifyCredentials(email: string, password: string): boolean {
  const user = USERS[email.toLowerCase()];
  if (!user) return false;
  return user.password === password;
}

export function getUserName(email: string): string {
  const user = USERS[email.toLowerCase()];
  return user?.name ?? email;
}

export function createSession(email: string): string {
  const token = generateToken();
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  sessions.set(token, {
    email: email.toLowerCase(),
    name: getUserName(email),
    expires,
  });
  return token;
}

export function validateSession(token: string): string | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expires) {
    sessions.delete(token);
    return null;
  }
  return session.email;
}

export function getSessionUser(token: string): Session | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expires) {
    sessions.delete(token);
    return null;
  }
  return session;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
