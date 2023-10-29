<script lang="ts">
  import type { ResolvedEvent } from "./event-utils";
  import { createDialog, melt } from "@melt-ui/svelte";

  export let event: ResolvedEvent;
  export let minuteHeight = 1;

  $: length = event.end.diff(event.start, "minutes").minutes;
  $: offset = event.start.diff(event.start.startOf("day"), "minutes").minutes;

  const {
    elements: { trigger, overlay, close, portalled, content },
    states: { open },
  } = createDialog();

  const statusStyle = {
    confirmed: "bg-sky-50 text-sky-800 border-sky-600",
    pending: "bg-yellow-50 text-yellow-800 border-yellow-600",
    canceled: "bg-red-50 text-red-800 border-red-600",
  };
</script>

<button
  class={`absolute flex p-2 rounded items-center font-semibold border-l-4 z-10 hover:shadow-md text-xs ${
    statusStyle[event.status]
  }`}
  style:top={`${offset * minuteHeight}px`}
  style:height={`${length * minuteHeight}px`}
  style:left={`${(100 / event.maxOverlap) * event.index}%`}
  style:width={`${100 / event.maxOverlap}%`}
  use:melt={$trigger}
>
  {event.patientName}
</button>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
      use:melt={$content}
      class="fixed left-1/2 top-1/2 z-50 w-96 translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg flex flex-col"
    >
      <h1 class="text-xl">{event.title}</h1>
      <span class="text-gray-500 mb-2"
        >{`${event.start.toLocaleString({
          month: "long",
          day: "2-digit",
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
        })} - ${event.end.toLocaleString({
          hour: "2-digit",
          minute: "2-digit",
        })}`}</span
      >
      <span>
        Professional: {event.professionalName}
      </span>
      <span>
        Patient: {event.patientName}
      </span>
      <span
        class={event.status === "confirmed" ? "text-sky-800" : "text-red-800"}
        >Status: {event.status}</span
      >
      <button use:melt={$close}>Close</button>
    </div>
  {/if}
</div>
