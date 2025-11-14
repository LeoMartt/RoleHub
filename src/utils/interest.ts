import type { Event } from "../types/event";
import { toggleInterest } from "../api/interests";

export async function handleToggleInterest(
  eventId: number,
  userId: number,
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
) {
  let snapshot: Event[] = [];
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
    setEvents(() => snapshot);
    throw err;
  }
}
