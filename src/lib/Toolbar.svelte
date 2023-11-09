<script lang="ts">
  import { ChevronLeft, ChevronRight } from "lucide-svelte";
  import type { DateTime } from "luxon";
  import { createEventDispatcher } from "svelte";

  // this should be readonly here to make sure we don't modify it accidentally
  export let startOfWeek: DateTime;

  const dispatch = createEventDispatcher<{
    changeWeek: number;
    toggleWeekend: boolean;
  }>();
</script>

<div class="flex gap-2 items-center mb-2">
  <button on:click={() => dispatch("changeWeek", -1)} aria-label="Previous week"
    ><ChevronLeft /></button
  >
  <button on:click={() => dispatch("changeWeek", 1)} aria-label="Next week"
    ><ChevronRight /></button
  >
  <div>
    <span class="text-xl"
      >{startOfWeek.toLocaleString({ month: "long", year: "numeric" })}</span
    >
    <span>Timezone: {startOfWeek.zoneName}</span>
    <input
      type="checkbox"
      name="showWeekend"
      id="showWeekend"
      on:change={(e) => dispatch("toggleWeekend", !!e.currentTarget?.checked)}
    />
    <label for="showWeekend">Show weekend</label>
  </div>
</div>
