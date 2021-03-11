<script>
  import PlotTable from './PlotTable.svelte';

  export let data;
  let legend = data.legend;

  let nextId = 1;
  data.tables.forEach(t => t.id = nextId++);

  function newTable() {
    data.tables = [...data.tables, {x: [], y: [], name: getName("new"), id: nextId++}]
  }

  function getName(suggestion) {
    if (data.tables.some(m => m.name == suggestion)) {
      return getName(suggestion + "'");
    } else {
      return suggestion;
    }
  }

  function removeTable(idx) {
    data.tables.splice(idx, 1);
    data.tables = data.tables;
  }

  $: data.legend = legend;
</script>

<input bind:value={legend}/>
{#each data.tables as table, idx (table.id)}
  <PlotTable bind:data={table}>
    <button on:click="{() => removeTable(idx)}" disabled="{data.tables.length == 1}">-</button>
  </PlotTable>
{/each}
<button on:click="{newTable}">+</button>
<hr>
