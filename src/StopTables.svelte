<script>
  import StopTable from './StopTable.svelte';

  export let data;
  export let keys;

  var nextId = 1;
  data.tables.forEach(t => t.id = nextId++);

  function newTable() {
    data = [...data, {x: [], y: [], name: getName("new"), id: nextId++}]
  }

  function getName(suggestion) {
    if (data.some(m => m.name == suggestion)) {
      return getName(suggestion + "'");
    } else {
      return suggestion;
    }
  }

  function removeTable(idx) {
    data.tables.splice(idx, 1);
    data.tables = data.tables;
  }

</script>

{#each data.tables as table (table.id)}
  <StopTable bind:data={table} name={table.name}>
    <button on:click="{() => removeTable(1)}" disabled="{data.length == 1}">-</button>
  </StopTable>
{/each}
<button on:click="{newTable}">+</button>
<hr>
