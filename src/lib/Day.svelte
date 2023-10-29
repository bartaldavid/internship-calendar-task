<script lang="ts">
  import { resolveOverlaps, type AppointmentDT } from "./event-utils";
  import Event from "./Event.svelte";

  export let minuteHeight = 1;
  export let events: AppointmentDT[];

  $: resolvedEvents = resolveOverlaps(events);
</script>

<!-- @component
Displays a day in the calendar with all its events and hours. 
Also resolves overlapping conflicts of events and displays them in a visually appealing way.
 -->

<!-- Adds a top margin in order to align with the hours' text on the left -->
<div class="flex flex-col border h-fit relative mt-2">
  {#each [...Array(24).keys()] as _}
    <div class="border" style:height={`${minuteHeight * 60}px`} />
  {/each}

  {#each resolvedEvents as event (event.id)}
    <Event {event} {minuteHeight} />
  {/each}
</div>
