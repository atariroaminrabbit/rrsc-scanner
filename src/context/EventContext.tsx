import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  StaffEventAssignment,
  getAssignmentsForStaff,
  pickDefaultEvent,
} from '../services/events';
import { useAuth } from './AuthContext';

interface EventContextValue {
  assignments: StaffEventAssignment[];
  activeAssignment: StaffEventAssignment | null;
  setActiveAssignment: (a: StaffEventAssignment) => void;
  isLoading: boolean;
}

const EventContext = createContext<EventContextValue | null>(null);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const { staff } = useAuth();
  const [assignments, setAssignments] = useState<StaffEventAssignment[]>([]);
  const [activeAssignment, setActiveAssignment] = useState<StaffEventAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!staff) return;
    setIsLoading(true);
    getAssignmentsForStaff(staff.id).then((result) => {
      setAssignments(result);
      setActiveAssignment(pickDefaultEvent(result));
      setIsLoading(false);
    });
  }, [staff]);

  return (
    <EventContext.Provider value={{ assignments, activeAssignment, setActiveAssignment, isLoading }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvent must be used within EventProvider');
  return ctx;
}
