<script>
  import StopTable from './StopTable.svelte';

  export let data;

  var nextId = 1;
  data.tables.forEach(t => t.id = nextId++);

  function newTable() {
    data.tables = [...data.tables, {data: [], id: nextId++}]
  }

  function removeTable(idx) {
    data.tables.splice(idx, 1);
    data.tables = data.tables;
  }

</script>

{#each data.tables as table, idx (table.id)}
  <StopTable bind:data={table.data} keys={data.keys}>
    <button on:click="{() => removeTable(idx)}" disabled="{data.tables.length == 1}">-</button>
  </StopTable>
{/each}
<button on:click="{newTable}">+</button>
<hr>
