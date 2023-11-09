import { DateTime } from "luxon";
import { Appointments } from "./events";

export const appointmentsDateTime = Appointments.map((appointment) => ({
  ...appointment,
  start: DateTime.fromISO(appointment.start),
  end: DateTime.fromISO(appointment.end),
}));

export type AppointmentDT = (typeof appointmentsDateTime)[0];

export interface ResolvedEvent extends AppointmentDT {
  maxOverlap: number;
  index: number;
}

// Resolves overlaps in an array of events in a day
export function resolveOverlaps(events: AppointmentDT[]) {
  // Add index and maxOverlap to each event
  const eventsWithIndices = events
    .map((event) => ({
      ...event,
      index: 0,
      // set this to 1 so that the width of the events can be set as 100% / maxOverlap
      maxOverlap: 1,
    }))
    .sort(
      (a, b) =>
        a.start.toMillis() - b.start.toMillis() ||
        // If the start times are the same, sort by end time reversed, to get the longest events first to fix some overlap issues
        b.end.toMillis() - a.end.toMillis()
    );

  eventsWithIndices.forEach((currentEvent, index) => {
    const overlaps = eventsWithIndices.filter((otherEvent) =>
      isOverlapping(otherEvent, currentEvent)
    );

    if (overlaps.length === 0) {
      return;
    }

    const maxOverlap = overlaps.length + 1;

    // Update maxOverlap and index for all overlapping events
    overlaps.forEach((overlap, overlapIndex) => {
      const eventIndex = eventsWithIndices.findIndex(
        (e) => e.id === overlap.id
      );
      if (eventIndex !== -1) {
        eventsWithIndices[eventIndex].maxOverlap = maxOverlap;
        eventsWithIndices[eventIndex].index = overlapIndex;
      }
    });

    eventsWithIndices[index].maxOverlap = maxOverlap;
    eventsWithIndices[index].index = overlaps.length;
  });
  return eventsWithIndices;
}

function isOverlapping(event1: ResolvedEvent, event2: ResolvedEvent) {
  return (
    event1.id !== event2.id &&
    event1.start < event2.end &&
    event1.end > event2.start
  );
}
