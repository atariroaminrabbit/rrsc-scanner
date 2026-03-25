/**
 * Mock authentication service.
 * Phase 7: Replace with real ERP API calls.
 */

export interface StaffMember {
  id: string;
  email: string;
  name: string;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  staff?: StaffMember;
  error?: string;
}

const MOCK_CREDENTIALS: Record<string, { password: string; staff: StaffMember }> = {
  'staff@roaminrabbit.com': {
    password: 'pass1234',
    staff: { id: 'staff-001', email: 'staff@roaminrabbit.com', name: 'Alex Tan' },
  },
  'pic@roaminrabbit.com': {
    password: 'pass5678',
    staff: { id: 'staff-002', email: 'pic@roaminrabbit.com', name: 'Sam Lee' },
  },
};

export async function login(email: string, password: string): Promise<LoginResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const entry = MOCK_CREDENTIALS[email.toLowerCase().trim()];
  if (!entry || entry.password !== password) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const token = `mock-token-${entry.staff.id}-${Date.now()}`;
  return { success: true, token, staff: entry.staff };
}
