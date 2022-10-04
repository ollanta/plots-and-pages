<script>
  export let data;
  let title = data.title;
  let log = data.log;
  let xdays = data.xdays;

  $: {
    data.title = title;
    data.log = log;
    data.xdays = xdays;
  }
</script>

<div>Title: <input bind:value={title}/></div>
<div>Log input: <input name="loginput" type=checkbox bind:checked={log}/></div>
<div>Use days not dates: <input name="xdays" type=checkbox bind:checked={xdays}/></div>
<hr>
