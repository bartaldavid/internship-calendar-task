<script lang="ts">
  import { DateTime } from "luxon";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";
  import { appointmentsDateTime } from "./event-utils";
  import Day from "./Day.svelte";
  import Toolbar from "./Toolbar.svelte";

  // Height of one minute in pixels. Stores this as a variable in a single place so we can implement zooming later.
  const minuteHeight = 1;

  // This is hardcoded here to 16th of October since that's the first day of the middle week of the events. Can also be set to "current week".
  let startOfWeek = DateTime.local().startOf("week");
  let showWeekend = true;

  $: daysInCurrentWeek = [...Array(showWeekend ? 7 : 5).keys()].map((day) =>
    startOfWeek.plus({ day })
  );

  function changeWeek(amount: number) {
    startOfWeek = startOfWeek.plus({ week: amount });
  }
</script>

<main
  class="bg-white rounded-lg shadow-lg w-full h-full flex flex-col overflow-y-scroll p-4"
>
  <Toolbar
    {startOfWeek}
    on:changeWeek={(e) => changeWeek(e.detail)}
    on:toggleWeekend={(e) => (showWeekend = e.detail)}
  />

  <div
    class="grid w-full gap-1"
    style:grid-template-columns={`max-content repeat(${daysInCurrentWeek.length}, 1fr)`}
  >
    <div />

    {#each daysInCurrentWeek as day}
      <div class="flex items-baseline gap-2 justify-center">
        <span class="text-3xl">{day.day}</span>
        <span>{day.weekdayShort}</span>
      </div>
    {/each}

    <ol>
      {#each [...Array(24).keys()] as hour}
        <li class="text-gray-500 text-sm text-end pr-2 font-light">
          <div style:height={`${minuteHeight * 60}px`}>
            {hour}:00
          </div>
        </li>
      {/each}
    </ol>

    <!-- Each day is an item in the CSS grid, this is easier to maintain than if every hour was separate.
    This way I can position every appointment relative to midnight on their date and fix overlaps. -->
    {#each daysInCurrentWeek as day (day.toISO())}
      {@const events = appointmentsDateTime.filter(
        (appointment) =>
          appointment.start.hasSame(day, "day") ||
          appointment.end.hasSame(day, "day")
      )}
      <Day {events} {minuteHeight} />
    {/each}
  </div>
</main>
