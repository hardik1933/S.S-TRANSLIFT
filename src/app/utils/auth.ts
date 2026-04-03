export function login(email: string, password: string, role: 'worker' | 'admin'): boolean {
  if (!email || !password) return false;

  // Demo: accept any non-empty credentials
  const token = btoa(`${email}:${role}:${Date.now()}`);
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_role', role);
  return true;
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_role');
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

export function getRole(): 'worker' | 'admin' | null {
  return (localStorage.getItem('auth_role') as 'worker' | 'admin' | null) ?? null;
}