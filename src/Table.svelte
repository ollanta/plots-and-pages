<script>
  export let table = [];

  var text = table.map(function(row) { return row.join(","); }).join("\n");

  $: {
    var rows = text.trim().split("\n")
    table = rows.map(function(row) {return row.split(",")});
  }
</script>

<textarea bind:value={text}></textarea>
