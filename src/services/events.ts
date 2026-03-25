/**
 * Mock events service.
 * Phase 7: Replace with real ERP API calls.
 */

export type EventStatus = 'Upcoming' | 'Active' | 'Expired';

export interface RRSCEvent {
  id: string;
  name: string;
  startTime: string; // ISO date string
  endTime: string;
  location: string;
}

export interface StaffEventAssignment {
  event: RRSCEvent;
  role: string;
}

const MOCK_EVENTS: RRSCEvent[] = [
  {
    id: 'evt-001',
    name: 'RRSC Night Market Crawl',
    startTime: '2026-03-23T18:00:00+08:00',
    endTime: '2026-03-23T23:00:00+08:00',
    location: 'Lau Pa Sat, Singapore',
  },
  {
    id: 'evt-002',
    name: 'RRSC Rooftop Social',
    startTime: '2026-03-28T19:00:00+08:00',
    endTime: '2026-03-28T22:00:00+08:00',
    location: 'Potato Head, Singapore',
  },
  {
    id: 'evt-003',
    name: 'RRSC City Walk — Tiong Bahru',
    startTime: '2026-03-15T10:00:00+08:00',
    endTime: '2026-03-15T13:00:00+08:00',
    location: 'Tiong Bahru, Singapore',
  },
];

// Assignments per staff member
const MOCK_ASSIGNMENTS: Record<string, StaffEventAssignment[]> = {
  'staff-001': [
    { event: MOCK_EVENTS[0], role: 'Registration PIC' },
    { event: MOCK_EVENTS[1], role: 'Registration PIC' },
    { event: MOCK_EVENTS[2], role: 'Registration PIC' },
  ],
  'staff-002': [
    { event: MOCK_EVENTS[0], role: 'Registration PIC' },
    { event: MOCK_EVENTS[1], role: 'Registration PIC' },
  ],
};

export function getEventStatus(event: RRSCEvent): EventStatus {
  const now = Date.now();
  const start = new Date(event.startTime).getTime();
  const end = new Date(event.endTime).getTime();
  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Active';
  return 'Expired';
}

export async function getAssignmentsForStaff(staffId: string): Promise<StaffEventAssignment[]> {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_ASSIGNMENTS[staffId] ?? [];
}

/** Returns the nearest upcoming or active event, falling back to the most recent expired. */
export function pickDefaultEvent(assignments: StaffEventAssignment[]): StaffEventAssignment | null {
  if (assignments.length === 0) return null;

  const now = Date.now();

  // Prefer active first
  const active = assignments.find((a) => getEventStatus(a.event) === 'Active');
  if (active) return active;

  // Then nearest upcoming
  const upcoming = assignments
    .filter((a) => getEventStatus(a.event) === 'Upcoming')
    .sort((a, b) => new Date(a.event.startTime).getTime() - new Date(b.event.startTime).getTime());
  if (upcoming.length > 0) return upcoming[0];

  // Fall back to most recent expired
  const expired = assignments
    .filter((a) => getEventStatus(a.event) === 'Expired')
    .sort((a, b) => new Date(b.event.endTime).getTime() - new Date(a.event.endTime).getTime());
  return expired[0] ?? null;
}
