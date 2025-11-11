import { useCallback, useEffect, useState } from 'react';
import { listEvents } from '../api/events';
import type { Event } from '../types/event';
import { getErrorMessage } from '../errors';

type UseEventsResult = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listEvents();
      setEvents(data);
    } catch (e) {
      setError(getErrorMessage('EVENTS_LOAD', e));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, isLoading, error, reload: load, setEvents };
}
