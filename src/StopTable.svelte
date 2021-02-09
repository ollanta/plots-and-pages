<script>
  import Table from './Table.svelte';

  export let name;
  export let data;
  export let keys;

  let rawTable = data.map(function(v) {
    return keys.map(function(k) {
      return v[k];
    });
  });

  console.log(keys);
  console.log(rawTable);

  function transformStops(rawtable) {
    var newdata = []

    rawtable.forEach(function(rawrow) {
      if (rawrow.length == keys.length) {
        var item = {};
        rawrow.forEach(function(v, i) {
          item[keys[i]] = v;
        });
        newdata.push(item);
      }      
    });

    return newdata;
  }

  $: data = transformStops(rawTable);
</script>

<h3>{name}</h3>
<Table bind:table={rawTable}/>
