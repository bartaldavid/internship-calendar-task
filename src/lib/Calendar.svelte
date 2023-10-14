<script lang='ts'>
  import { DateTime } from "luxon";
  import { createDialog } from '@melt-ui/svelte'
  import { Appointments } from "./events";
  import { Calendar } from "lucide-svelte"
</script>

<!-- YOUR WORK STARTS HERE -->
<div class="bg-white rounded-lg shadow-lg w-full h-full flex flex-col gap-3 items-center justify-center">
  <Calendar size='45' />
  <p class="text-5xl text-center">Turn this into a calendar</p>
</div>