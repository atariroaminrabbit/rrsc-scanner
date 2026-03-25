import React, { createContext, useContext, useEffect, useState } from 'react';
import { Attendee, getAttendeesForEvent } from '../services/attendees';
import { useEvent } from './EventContext';

interface AttendeeContextValue {
  attendees: Attendee[];
  isLoading: boolean;
  sessionCheckIns: number;
  checkIn: (registrationId: string) => Attendee | null;
}

const AttendeeContext = createContext<AttendeeContextValue | null>(null);

export function AttendeeProvider({ children }: { children: React.ReactNode }) {
  const { activeAssignment } = useEvent();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionCheckIns, setSessionCheckIns] = useState(0);

  useEffect(() => {
    if (!activeAssignment) return;
    setIsLoading(true);
    setAttendees([]);
    setSessionCheckIns(0);
    getAttendeesForEvent(activeAssignment.event.id).then((data) => {
      setAttendees(data);
      setIsLoading(false);
    });
  }, [activeAssignment?.event.id]);

  const checkIn = (registrationId: string): Attendee | null => {
    const id = registrationId.trim().toUpperCase();
    let found: Attendee | null = null;

    setAttendees((prev) =>
      prev.map((a) => {
        if (a.registrationId.toUpperCase() === id) {
          found = { ...a, checkedIn: true, checkInCount: a.checkInCount + 1, checkInTimes: [...a.checkInTimes, new Date().toISOString()] };
          return found;
        }
        return a;
      })
    );

    if (found) setSessionCheckIns((n) => n + 1);

    return found;
  };

  return (
    <AttendeeContext.Provider value={{ attendees, isLoading, sessionCheckIns, checkIn }}>
      {children}
    </AttendeeContext.Provider>
  );
}

export function useAttendees() {
  const ctx = useContext(AttendeeContext);
  if (!ctx) throw new Error('useAttendees must be used within AttendeeProvider');
  return ctx;
}
