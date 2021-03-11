<script>
  import Table from './Table.svelte';

  export let data;
  let name = data.name;

  let rawTable = data.x.map((v,i) => [v, data.y[i]]);

  function transformScatter(rawtable) {
    let xy = {
      x: [],
      y: [],
    };

    rawtable.forEach(rawrow => {
      if (rawrow.length >= 2) {
        xy.x.push(rawrow[0]);
        xy.y.push(Number(rawrow[1]));
      }
    });

    return xy;
  }

  $: {
    let xy = transformScatter(rawTable);
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
