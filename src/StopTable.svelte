<script>
  import Table from './Table.svelte';

  export let data;
  export let keys;

  let rawTable = data.map(v => keys.map(k => v[k]));

  function transformStops(rawtable) {
    let newdata = [];

    rawtable.forEach(rawrow => {
      if (rawrow.length == keys.length) {
        let item = {};
        rawrow.forEach((v, i) => item[keys[i]] = v);
        newdata.push(item);
      }      
    });

    return newdata;
  }

  $: data = transformStops(rawTable);
</script>

<Table bind:table={rawTable}/>
