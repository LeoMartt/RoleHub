import type { Event } from "../types/event";
import { toggleInterest } from "../api/interests";

/**
 * Alterna interesse do usuário no evento com update otimista.
 */
export async function handleToggleInterest(
  eventId: number,
  userId: number,
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
) {
  let snapshot: Event[] = [];
  // otimista
  setEvents((prev) => {
    snapshot = prev;
    return prev.map((ev) => {
      if (ev.id !== eventId) return ev;
      const next = !ev.interestedByMe;
      return {
        ...ev,
        interestedByMe: next,
        interestedCount: Math.max(0, ev.interestedCount + (next ? 1 : -1)),
      };
    });
  });

  try {
    const { isInterested } = await toggleInterest(userId, eventId);

    // reconcilia caso o backend responda diferente do otimista
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        if ((ev.interestedByMe ?? false) === isInterested) return ev;

        const wasGoing = (ev.interestedByMe ?? false) ? 1 : 0;
        return {
          ...ev,
          interestedByMe: isInterested,
          interestedCount: Math.max(
            0,
            ev.interestedCount - wasGoing + (isInterested ? 1 : 0)
          ),
        };
      })
    );
  } catch (err) {
    // rollback
    setEvents(() => snapshot);
    throw err;
  }
}
