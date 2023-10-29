<script lang="ts">
  import { DateTime } from "luxon";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";
  import { appointmentsDateTime } from "./event-utils";
  import Day from "./Day.svelte";

  // Height of one minute in pixels. Stores this as a variable so we can implement zooming later.
  const minuteHeight = 1;

  let startOfWeek = DateTime.local(2023, 10, 16).startOf("week");

  $: daysInCurrentWeek = [...Array(7).keys()].map((day) =>
    startOfWeek.plus({ day })
  );

  function changeWeek(amount: number) {
    startOfWeek = startOfWeek.plus({ week: amount });
  }
</script>

<main
  class="bg-white rounded-lg shadow-lg w-full h-full flex flex-col overflow-y-scroll p-4"
>
  <div class="flex gap-2 items-center mb-2">
    <button on:click={() => changeWeek(-1)} aria-label="Previous week"
      ><ChevronLeft /></button
    >
    <button on:click={() => changeWeek(+1)} aria-label="Next week"
      ><ChevronRight /></button
    >
    <div>
      <span class="text-xl"
        >{startOfWeek.toLocaleString({ month: "long", year: "numeric" })}</span
      >
      <span>Timezone: {startOfWeek.zoneName}</span>
    </div>
  </div>

  <div class="grid grid-cols-[max-content_repeat(7,1fr)] w-full gap-1">
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
