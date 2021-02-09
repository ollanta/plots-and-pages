<script>
  import Table from './Table.svelte';

  export let name;
  export let data;

  let rawTable = data.x.map(function(v,i) {
    return [v, data.y[i]]
  });

  function transformScatter(rawtable) {
    var data = {
      x: [],
      y: [],
      name: name,
    };

    rawtable.forEach(function(rawrow) {
      if (rawrow.length >= 2) {
        data.x.push(rawrow[0]);
        data.y.push(Number(rawrow[1]));
      }      
    });

    return data;
  }

  $: data = transformScatter(rawTable);
  
</script>

<h3>{name}</h3>
<Table bind:table={rawTable}/>
