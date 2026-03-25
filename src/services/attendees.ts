/**
 * Mock attendees service.
 * Phase 7: Replace with real ERP API calls.
 */

export interface Attendee {
  registrationId: string;
  name: string;
  checkedIn: boolean;
  checkInCount: number;
  checkInTimes: string[]; // ISO timestamps, one per entry
}

const MOCK_ATTENDEES: Attendee[] = [
  { registrationId: 'RRSC-2026-001', name: 'Aiden Tan', checkedIn: true, checkInCount: 2, checkInTimes: ['2026-03-23T17:03:00.000Z', '2026-03-23T20:45:00.000Z'] },
  { registrationId: 'RRSC-2026-002', name: 'Brianna Lim', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:08:00.000Z'] },
  { registrationId: 'RRSC-2026-003', name: 'Caleb Ng', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-004', name: 'Diana Chua', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:11:00.000Z'] },
  { registrationId: 'RRSC-2026-005', name: 'Ethan Goh', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-006', name: 'Fiona Yeo', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-007', name: 'Gabriel Ong', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:15:00.000Z'] },
  { registrationId: 'RRSC-2026-008', name: 'Hannah Koh', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-009', name: 'Isaac Teo', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:22:00.000Z'] },
  { registrationId: 'RRSC-2026-010', name: 'Jasmine Wong', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-011', name: 'Kevin Lee', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-012', name: 'Laura Sim', checkedIn: true, checkInCount: 3, checkInTimes: ['2026-03-23T17:05:00.000Z', '2026-03-23T19:30:00.000Z', '2026-03-23T21:10:00.000Z'] },
  { registrationId: 'RRSC-2026-013', name: 'Marcus Chan', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-014', name: 'Natalie Ho', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:30:00.000Z'] },
  { registrationId: 'RRSC-2026-015', name: 'Oliver Lau', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-016', name: 'Priya Rajan', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:35:00.000Z'] },
  { registrationId: 'RRSC-2026-017', name: 'Quinn Beh', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-018', name: 'Rachel Phua', checkedIn: true, checkInCount: 2, checkInTimes: ['2026-03-23T17:40:00.000Z', '2026-03-23T20:15:00.000Z'] },
  { registrationId: 'RRSC-2026-019', name: 'Samuel Wee', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-020', name: 'Tiffany Seah', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:45:00.000Z'] },
  { registrationId: 'RRSC-2026-021', name: 'Uma Pillai', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-022', name: 'Victor Ang', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-023', name: 'Wendy Tan', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:50:00.000Z'] },
  { registrationId: 'RRSC-2026-024', name: 'Xavier Foo', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-025', name: 'Yvonne Lim', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T17:55:00.000Z'] },
  { registrationId: 'RRSC-2026-026', name: 'Zachary Goh', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-027', name: 'Amelia Yap', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-028', name: 'Brandon Koh', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T18:02:00.000Z'] },
  { registrationId: 'RRSC-2026-029', name: 'Chloe Tay', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-030', name: 'Darren Chia', checkedIn: true, checkInCount: 2, checkInTimes: ['2026-03-23T18:10:00.000Z', '2026-03-23T21:00:00.000Z'] },
  { registrationId: 'RRSC-2026-031', name: 'Eleanor Soh', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-032', name: 'Felix Lim', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-033', name: 'Grace Tan', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T18:20:00.000Z'] },
  { registrationId: 'RRSC-2026-034', name: 'Henry Ng', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-035', name: 'Irene Chua', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T18:25:00.000Z'] },
  { registrationId: 'RRSC-2026-036', name: 'Jonathan Yeo', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-037', name: 'Karen Ong', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-038', name: 'Leon Toh', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T18:30:00.000Z'] },
  { registrationId: 'RRSC-2026-039', name: 'Michelle Koh', checkedIn: false, checkInCount: 0, checkInTimes: [] },
  { registrationId: 'RRSC-2026-040', name: 'Nathan Poh', checkedIn: true, checkInCount: 1, checkInTimes: ['2026-03-23T18:35:00.000Z'] },
];

// Attendee lists keyed by event ID
const EVENT_ATTENDEES: Record<string, Attendee[]> = {
  'evt-001': MOCK_ATTENDEES,
  'evt-002': MOCK_ATTENDEES.slice(0, 20),
  'evt-003': MOCK_ATTENDEES.slice(0, 15),
};

export async function getAttendeesForEvent(eventId: string): Promise<Attendee[]> {
  await new Promise((r) => setTimeout(r, 600));
  return EVENT_ATTENDEES[eventId] ?? [];
}
