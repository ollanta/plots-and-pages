<script>
  export let table = [];

  let text = table.map(row => row.join(",")).join("\n");

  $: {
    let rows = text.trim().split("\n")
    table = rows.map(row => row.split(","));
  }
</script>

<textarea bind:value={text}></textarea>
