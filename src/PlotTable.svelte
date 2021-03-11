<script>
  import Table from './Table.svelte';

  export let data;
  let name = data.name;

  let rawTable = data.x.map(function(v,i) {
    return [v, data.y[i]]
  });

  function transformScatter(rawtable) {
    var xy = {
      x: [],
      y: [],
    };

    rawtable.forEach(function(rawrow) {
      if (rawrow.length >= 2) {
        xy.x.push(rawrow[0]);
        xy.y.push(Number(rawrow[1]));
      }      
    });

    return xy;
  }

  $: {
    var xy = transformScatter(rawTable);
    data.x = xy.x;
    data.y = xy.y;
  }

  $: data.name = name;
  
</script>

<div>
  <input bind:value={name}/>
  <slot></slot>
</div>
<Table bind:table={rawTable}/>
