<script>
  export let data;
  export let layout;

  var initialized;

  function scriptlyLoaded() {
	Plotly.newPlot('plotly-graph', data, layout);
    initialized = true;
  }

  $: if (initialized) {
    Plotly.react('plotly-graph', data, layout);
  }
</script>

<svelte:head>
  <script src="https://cdn.plot.ly/plotly-latest.min.js" on:load="{scriptlyLoaded}"></script>
</svelte:head>

<div id="plotly-graph"></div>
